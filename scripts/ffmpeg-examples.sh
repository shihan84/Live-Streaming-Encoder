# Live Streaming Encoder Configuration Examples
# Based on your FFmpeg output format with SCTE-35 support

## Basic SRT Stream with SCTE-35 Pass-through
# This matches your output format exactly:
# Stream #0:0: Video: h264 (Constrained Baseline), yuv420p, 1280x720, 29.97 fps
# Stream #0:1: Audio: aac (LC), 48000 Hz, stereo, fltp
# Stream #1:0: Data: none (SCTE-35)

./ffmpeg-scte35.sh \
    -i "srt://itassist.one:9999?streamid=#!::r=live/live,m=publish" \
    -o "srt://itassist.one:8888?streamid=#!::r=live/live,m=publish" \
    -b 5000 \
    -r "1280x720" \
    -p "high" \
    -g 12 \
    -bf 5 \
    --profile "high" \
    --chroma "4:2:0" \
    --aspect-ratio "16:9" \
    --keyframe-interval 12 \
    --audio-bitrate 128 \
    --audio-lkfs -20 \
    --audio-sample-rate 48000 \
    --scte35-pid 500 \
    --null-pid 8191 \
    --latency 2000 \
    -s true \
    --session-id "live_$(date +%s)"

## High Quality 1080p Stream with Enhanced SCTE-35
./ffmpeg-scte35.sh \
    -i "srt://input.example.com:9999?streamid=hd1080,m=publish" \
    -o "srt://output.example.com:8888?streamid=hd1080,m=publish" \
    -b 8000 \
    -r "1920x1080" \
    -p "high" \
    -g 12 \
    -bf 3 \
    --profile "high" \
    --chroma "4:2:0" \
    --aspect-ratio "16:9" \
    --keyframe-interval 12 \
    --audio-bitrate 192 \
    --audio-lkfs -23 \
    --audio-sample-rate 48000 \
    --scte35-pid 500 \
    --null-pid 8191 \
    --latency 1500 \
    -s true \
    --session-id "hd1080_$(date +%s)"

## Multi-bitrate ABR Stream with SCTE-35
# For adaptive bitrate streaming, you would run multiple instances:

# High Quality
./ffmpeg-scte35.sh \
    -i "srt://input.example.com:9999?streamid=source,m=publish" \
    -o "srt://output.example.com:8888?streamid=high,m=publish" \
    -b 8000 \
    -r "1920x1080" \
    -p "high" \
    -s true \
    --session-id "high_$(date +%s)" &

# Medium Quality
./ffmpeg-scte35.sh \
    -i "srt://input.example.com:9999?streamid=source,m=publish" \
    -o "srt://output.example.com:8889?streamid=medium,m=publish" \
    -b 5000 \
    -r "1280x720" \
    -p "medium" \
    -s true \
    --session-id "medium_$(date +%s)" &

# Low Quality
./ffmpeg-scte35.sh \
    -i "srt://input.example.com:9999?streamid=source,m=publish" \
    -o "srt://output.example.com:8890?streamid=low,m=publish" \
    -b 2500 \
    -r "854x480" \
    -p "fast" \
    -s true \
    --session-id "low_$(date +%s)" &

## RTMP Input with SCTE-35 to SRT Output
./ffmpeg-scte35.sh \
    -i "rtmp://input.example.com/live/stream1" \
    -o "srt://output.example.com:8888?streamid=rtmp_converted,m=publish" \
    -b 6000 \
    -r "1920x1080" \
    -p "high" \
    -g 12 \
    -bf 3 \
    --profile "high" \
    --chroma "4:2:0" \
    --aspect-ratio "16:9" \
    --keyframe-interval 12 \
    --audio-bitrate 128 \
    --audio-lkfs -20 \
    --audio-sample-rate 48000 \
    --scte35-pid 500 \
    --null-pid 8191 \
    --latency 2000 \
    -s true \
    --session-id "rtmp_srt_$(date +%s)"

## HLS Output with SCTE-35 Segmentation
# Note: This requires additional HLS segmentation setup
./ffmpeg-scte35.sh \
    -i "srt://input.example.com:9999?streamid=live,m=publish" \
    -o "/var/www/hls/stream_$(date +%s).ts" \
    -b 5000 \
    -r "1280x720" \
    -p "high" \
    -g 12 \
    -bf 5 \
    --profile "high" \
    --chroma "4:2:0" \
    --aspect-ratio "16:9" \
    --keyframe-interval 12 \
    --audio-bitrate 128 \
    --audio-lkfs -20 \
    --audio-sample-rate 48000 \
    --scte35-pid 500 \
    --null-pid 8191 \
    --latency 2000 \
    -s true \
    --session-id "hls_$(date +%s)"

## UDP Input with SCTE-35 (for broadcast scenarios)
./ffmpeg-scte35.sh \
    -i "udp://239.1.1.1:5000" \
    -o "srt://output.example.com:8888?streamid=udp_source,m=publish" \
    -b 15000 \
    -r "1920x1080" \
    -p "high" \
    -g 12 \
    -bf 3 \
    --profile "high" \
    --chroma "4:2:2" \
    --aspect-ratio "16:9" \
    --keyframe-interval 12 \
    --audio-bitrate 256 \
    --audio-lkfs -23 \
    --audio-sample-rate 48000 \
    --scte35-pid 500 \
    --null-pid 8191 \
    --latency 1000 \
    -s true \
    --session-id "broadcast_$(date +%s)"

## Low Latency Configuration
./ffmpeg-scte35.sh \
    -i "srt://input.example.com:9999?streamid=lowlatency,m=publish" \
    -o "srt://output.example.com:8888?streamid=lowlatency,m=publish" \
    -b 4000 \
    -r "1280x720" \
    -p "ultrafast" \
    -g 6 \
    -bf 0 \
    --profile "baseline" \
    --chroma "4:2:0" \
    --aspect-ratio "16:9" \
    --keyframe-interval 6 \
    --audio-bitrate 96 \
    --audio-lkfs -20 \
    --audio-sample-rate 44100 \
    --scte35-pid 500 \
    --null-pid 8191 \
    --latency 500 \
    -s true \
    --session-id "lowlatency_$(date +%s)"

## Analysis Commands
# Before starting encoding, analyze the input stream:

# Analyze SCTE-35 streams
python3 /app/scripts/scte35-analyzer.py "srt://input.example.com:9999?streamid=live,m=publish"

# Check FFmpeg stream detection
ffmpeg -i "srt://input.example.com:9999?streamid=live,m=publish" -hide_banner

## Expected Output Format
# When using these configurations, you should see output similar to:
#
# Stream #0:0: Video: h264 (Constrained Baseline), yuv420p, 1280x720, 29.97 fps, 29.97 tbr, 90k tbn, start 42449.928244
# Stream #0:1: Audio: aac (LC), 48000 Hz, stereo, fltp, start 42449.957578
# Stream #1:0: Data: none
# Stream mapping:
# Stream #0:0 -> #0:0 (h264 (native) -> h264 (libx264))
# Stream #0:1 -> #0:1 (aac (native) -> aac (native))
# Stream #1:0 -> #0:2 (copy)
# Output #0, mpegts, to 'srt://itassist.one:8888?streamid=#!::r=live/live,m=publish'
#   stream_id       : 0

## Key Parameters Explained:
#
# Video Parameters:
# -b: Video bitrate in Mbps
# -r: Resolution (width x height)
# -p: Encoder preset (ultrafast, superfast, veryfast, faster, fast, medium, slow, slower, veryslow, high)
# -g: GOP size
# -bf: B-frames
# --profile: H.264 profile (baseline, main, high)
# --chroma: Chroma subsampling (4:2:0, 4:2:2, 4:4:4)
# --aspect-ratio: Display aspect ratio
# --keyframe-interval: Keyframe interval
#
# Audio Parameters:
# --audio-bitrate: Audio bitrate in kbps
# --audio-lkfs: Audio loudness target (LKFS)
# --audio-sample-rate: Audio sample rate in Hz
#
# SCTE-35 Parameters:
# --scte35-pid: SCTE-35 PID (default: 500)
# --null-pid: Null packet PID (default: 8191)
# -s: Enable SCTE-35 support (true/false)
#
# General Parameters:
# --latency: Target latency in milliseconds
# --session-id: Unique session identifier
# -i: Input URL
# -o: Output URL