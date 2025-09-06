#!/bin/bash
# FFmpeg with SCTE-35 wrapper script for distributor requirements

set -e

# Default values based on distributor requirements
FFMPEG_PATH="/usr/local/bin/ffmpeg"
OUTPUT_DIR="/var/www/hls"
LOG_DIR="/app/logs"

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -i|--input)
            INPUT_URL="$2"
            shift 2
            ;;
        -o|--output)
            OUTPUT_URL="$2"
            shift 2
            ;;
        -b|--bitrate)
            BITRATE="$2"
            shift 2
            ;;
        -r|--resolution)
            RESOLUTION="$2"
            shift 2
            ;;
        -p|--preset)
            PRESET="$2"
            shift 2
            ;;
        -g|--gop-size)
            GOP_SIZE="$2"
            shift 2
            ;;
        -bf|--b-frames)
            B_FRAMES="$2"
            shift 2
            ;;
        --profile)
            PROFILE="$2"
            shift 2
            ;;
        --chroma)
            CHROMA="$2"
            shift 2
            ;;
        --aspect-ratio)
            ASPECT_RATIO="$2"
            shift 2
            ;;
        --keyframe-interval)
            KEYFRAME_INTERVAL="$2"
            shift 2
            ;;
        --pcr)
            PCR="$2"
            shift 2
            ;;
        --audio-codec)
            AUDIO_CODEC="$2"
            shift 2
            ;;
        --audio-bitrate)
            AUDIO_BITRATE="$2"
            shift 2
            ;;
        --audio-lkfs)
            AUDIO_LKFS="$2"
            shift 2
            ;;
        --audio-sample-rate)
            AUDIO_SAMPLE_RATE="$2"
            shift 2
            ;;
        --scte35-pid)
            SCTE35_PID="$2"
            shift 2
            ;;
        --null-pid)
            NULL_PID="$2"
            shift 2
            ;;
        --latency)
            LATENCY="$2"
            shift 2
            ;;
        -s|--scte35)
            SCTE35_ENABLED="$2"
            shift 2
            ;;
        -l|--log-file)
            LOG_FILE="$2"
            shift 2
            ;;
        --session-id)
            SESSION_ID="$2"
            shift 2
            ;;
        *)
            echo "Unknown option: $1"
            exit 1
            ;;
    esac
done

# Validate required parameters
if [[ -z "$INPUT_URL" ]]; then
    echo "Error: Input URL is required"
    exit 1
fi

if [[ -z "$OUTPUT_URL" ]]; then
    echo "Error: Output URL is required"
    exit 1
fi

# Set defaults based on distributor requirements
BITRATE=${BITRATE:-5000}
RESOLUTION=${RESOLUTION:-1920x1080}
PRESET=${PRESET:-high}
GOP_SIZE=${GOP_SIZE:-12}
B_FRAMES=${B_FRAMES:-5}
PROFILE=${PROFILE:-high}
CHROMA=${CHROMA:-4:2:0}
ASPECT_RATIO=${ASPECT_RATIO:-16:9}
KEYFRAME_INTERVAL=${KEYFRAME_INTERVAL:-12}
PCR=${PCR:-video_embedded}
AUDIO_CODEC=${AUDIO_CODEC:-aac-lc}
AUDIO_BITRATE=${AUDIO_BITRATE:-128}
AUDIO_LKFS=${AUDIO_LKFS:--20}
AUDIO_SAMPLE_RATE=${AUDIO_SAMPLE_RATE:-48000}
SCTE35_ENABLED=${SCTE35_ENABLED:-true}
SCTE35_PID=${SCTE35_PID:-500}
NULL_PID=${NULL_PID:-8191}
LATENCY=${LATENCY:-2000}
SESSION_ID=${SESSION_ID:-$(date +%s)}
LOG_FILE=${LOG_FILE:-"$LOG_DIR/ffmpeg_${SESSION_ID}.log"}

# Create output directory
mkdir -p "$OUTPUT_DIR"

# Calculate audio volume from LKFS
AUDIO_VOLUME=$(python3 -c "print(10 ** ($AUDIO_LKFS / 20))")

# Function to detect SCTE-35 streams in input
detect_scte35_streams() {
    echo "Detecting SCTE-35 streams in input..."
    local detection_log="$LOG_DIR/scte35_detection_${SESSION_ID}.log"
    
    # Run FFmpeg probe to detect streams
    "$FFMPEG_PATH" -i "$INPUT_URL" -hide_banner > "$detection_log" 2>&1
    
    # Check for SCTE-35 data streams
    if grep -q "Stream.*Data.*none" "$detection_log"; then
        echo "SCTE-35 data stream detected"
        return 0
    else
        echo "No SCTE-35 data stream found in input"
        return 1
    fi
}

# Build FFmpeg command with distributor specifications
FFMPEG_CMD=("$FFMPEG_PATH")

# Input analysis and stream detection
echo "Analyzing input streams..."
detect_scte35_streams
SCTE35_DETECTED=$?

# Input
FFMPEG_CMD+=("-i" "$INPUT_URL")

# Video codec settings - Distributor requirements
FFMPEG_CMD+=("-c:v" "libx264")
FFMPEG_CMD+=("-preset" "$PRESET")
FFMPEG_CMD+=("-profile:v" "$PROFILE")
FFMPEG_CMD+=("-b:v" "${BITRATE}k")
FFMPEG_CMD+=("-maxrate" "$(($BITRATE * 3 / 2))k")
FFMPEG_CMD+=("-bufsize" "$(($BITRATE * 2))k")
FFMPEG_CMD+=("-s" "$RESOLUTION")
FFMPEG_CMD+=("-aspect" "$ASPECT_RATIO")
FFMPEG_CMD+=("-g" "$KEYFRAME_INTERVAL")
FFMPEG_CMD+=("-keyint_min" "$KEYFRAME_INTERVAL")
FFMPEG_CMD+=("-bf" "$B_FRAMES")
FFMPEG_CMD+=("-pix_fmt" "yuv${CHROMA//:/}p")
FFMPEG_CMD+=("-sc_threshold" "0")

# PCR settings
FFMPEG_CMD+=("-pcr_period" "20")
FFMPEG_CMD+=("-mpegts_pcr_start" "0")

# Audio codec settings - Distributor requirements
FFMPEG_CMD+=("-c:a" "aac")
FFMPEG_CMD+=("-profile:a" "aac_low")
FFMPEG_CMD+=("-b:a" "${AUDIO_BITRATE}k")
FFMPEG_CMD+=("-ar" "$AUDIO_SAMPLE_RATE")
FFMPEG_CMD+=("-af" "volume=$AUDIO_VOLUME")

# SCTE-35 settings - Enhanced for your output format
FFMPEG_CMD+=("-scte35_pid" "$SCTE35_PID")
FFMPEG_CMD+=("-mpegts_null_pid" "$NULL_PID")

# Transport stream settings
FFMPEG_CMD+=("-f" "mpegts")
FFMPEG_CMD+=("-mpegts_transport_stream_id" "1")
FFMPEG_CMD+=("-mpegts_original_network_id" "1")
FFMPEG_CMD+=("-mpegts_service_id" "1")
FFMPEG_CMD+=("-mpegts_service_type" "digital_tv")
FFMPEG_CMD+=("-mpegts_pmt_start_pid" "16")
FFMPEG_CMD+=("-mpegts_start_pid" "256")

# Latency settings for SRT
FFMPEG_CMD+=("-flush_packets" "1")
FFMPEG_CMD+=("-fflags" "+genpts+ignidx")

# Enhanced SCTE-35 handling based on your output format
if [[ "$SCTE35_ENABLED" == "true" ]]; then
    if [[ $SCTE35_DETECTED -eq 0 ]]; then
        echo "SCTE-35 stream detected, enabling pass-through"
        FFMPEG_CMD+=("-scte35_from_stream" "true")
        FFMPEG_CMD+=("-map" "0:v:0")    # Map video stream
        FFMPEG_CMD+=("-map" "0:a:0")    # Map audio stream  
        FFMPEG_CMD+=("-map" "0:d:0")    # Map data stream (SCTE-35)
    else
        echo "No SCTE-35 stream detected, enabling SCTE-35 generation"
        FFMPEG_CMD+=("-scte35_from_stream" "true")
        FFMPEG_CMD+=("-map" "0:v:0")    # Map video stream
        FFMPEG_CMD+=("-map" "0:a:0")    # Map audio stream
    fi
else
    # Default mapping without SCTE-35
    FFMPEG_CMD+=("-map" "0:v:0")    # Map video stream
    FFMPEG_CMD+=("-map" "0:a:0")    # Map audio stream
fi

# Output
FFMPEG_CMD+=("$OUTPUT_URL")

# Logging
echo "Starting FFmpeg with SCTE-35 support for distributor requirements..."
echo "Command: ${FFMPEG_CMD[*]}"
echo "Log file: $LOG_FILE"
echo "Distributor Specs:"
echo "  Resolution: $RESOLUTION"
echo "  Video Bitrate: ${BITRATE} Mbps"
echo "  GOP Size: $GOP_SIZE"
echo "  B Frames: $B_FRAMES"
echo "  Profile: $PROFILE"
echo "  Chroma: $CHROMA"
echo "  Aspect Ratio: $ASPECT_RATIO"
echo "  Audio Codec: $AUDIO_CODEC"
echo "  Audio Bitrate: ${AUDIO_BITRATE} kbps"
echo "  Audio LKFS: $AUDIO_LKFS"
echo "  Audio Sample Rate: $AUDIO_SAMPLE_RATE Hz"
echo "  SCTE-35 PID: $SCTE35_PID"
echo "  Null PID: $NULL_PID"
echo "  Latency: $LATENCY ms"
echo "  SCTE-35 Enabled: $SCTE35_ENABLED"
echo "  SCTE-35 Detected: $([[ $SCTE35_DETECTED -eq 0 ]] && echo 'Yes' || echo 'No')"

# Create a startup info file
STARTUP_INFO="$LOG_DIR/ffmpeg_startup_${SESSION_ID}.json"
cat > "$STARTUP_INFO" << EOF
{
  "session_id": "$SESSION_ID",
  "input_url": "$INPUT_URL",
  "output_url": "$OUTPUT_URL",
  "start_time": "$(date -Iseconds)",
  "configuration": {
    "bitrate": $BITRATE,
    "resolution": "$RESOLUTION",
    "preset": "$PRESET",
    "gop_size": $GOP_SIZE,
    "b_frames": $B_FRAMES,
    "profile": "$PROFILE",
    "chroma": "$CHROMA",
    "aspect_ratio": "$ASPECT_RATIO",
    "keyframe_interval": $KEYFRAME_INTERVAL,
    "audio_codec": "$AUDIO_CODEC",
    "audio_bitrate": $AUDIO_BITRATE,
    "audio_lkfs": $AUDIO_LKFS,
    "audio_sample_rate": $AUDIO_SAMPLE_RATE,
    "scte35_pid": $SCTE35_PID,
    "null_pid": $NULL_PID,
    "latency": $LATENCY,
    "scte35_enabled": $SCTE35_ENABLED,
    "scte35_detected": $([[ $SCTE35_DETECTED -eq 0 ]] && echo 'true' || echo 'false')
  },
  "command": "${FFMPEG_CMD[*]}"
}
EOF

echo "Startup info saved to: $STARTUP_INFO"

# Run FFmpeg with enhanced error handling
echo "Starting FFmpeg process..."
exec "${FFMPEG_CMD[@]}" > "$LOG_FILE" 2>&1 &

FFMPEG_PID=$!
echo "FFmpeg process started with PID: $FFMPEG_PID"

# Wait a moment and check if process is still running
sleep 2
if ! kill -0 $FFMPEG_PID 2>/dev/null; then
    echo "ERROR: FFmpeg process failed to start"
    echo "Check log file: $LOG_FILE"
    exit 1
fi

echo "FFmpeg is running successfully. Monitoring output..."
echo "Press Ctrl+C to stop the encoding process"

# Monitor the log file for SCTE-35 events
tail -f "$LOG_FILE" | grep -i -E "(scte-35|stream.*data|mapping|pid.*500)" &
MONITOR_PID=$!

# Function to cleanup on exit
cleanup() {
    echo "Cleaning up..."
    kill $MONITOR_PID 2>/dev/null
    kill $FFMPEG_PID 2>/dev/null
    wait $FFMPEG_PID 2>/dev/null
    echo "FFmpeg process stopped"
    exit 0
}

# Set trap for cleanup
trap cleanup SIGINT SIGTERM

# Wait for FFmpeg process to complete
wait $FFMPEG_PID
cleanup