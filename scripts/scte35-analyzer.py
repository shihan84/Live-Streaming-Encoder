#!/usr/bin/env python3
"""
SCTE-35 Stream Analyzer
Analyzes FFmpeg output to detect and report on SCTE-35 streams
"""

import re
import json
import subprocess
import sys
from datetime import datetime
from pathlib import Path

class SCTE35Analyzer:
    def __init__(self, input_url):
        self.input_url = input_url
        self.log_dir = Path("/app/logs")
        self.log_dir.mkdir(exist_ok=True)
        self.session_id = datetime.now().strftime("%Y%m%d_%H%M%S")
        
    def analyze_streams(self):
        """Analyze input streams for SCTE-35 data"""
        print(f"🔍 Analyzing streams for: {self.input_url}")
        print("=" * 60)
        
        # Run FFmpeg to get stream information
        analysis_log = self.log_dir / f"stream_analysis_{self.session_id}.log"
        
        try:
            # Get detailed stream information
            cmd = [
                "ffmpeg", "-i", self.input_url, "-hide_banner"
            ]
            
            with open(analysis_log, 'w') as f:
                result = subprocess.run(cmd, stderr=f, stdout=f, text=True)
            
            # Parse the analysis
            streams_info = self._parse_ffmpeg_output(analysis_log)
            
            # Generate report
            self._generate_report(streams_info)
            
            return streams_info
            
        except Exception as e:
            print(f"❌ Error analyzing streams: {e}")
            return None
    
    def _parse_ffmpeg_output(self, log_file):
        """Parse FFmpeg output to extract stream information"""
        streams_info = {
            "input_url": self.input_url,
            "analysis_time": datetime.now().isoformat(),
            "streams": [],
            "scte35_detected": False,
            "scte35_streams": [],
            "video_streams": [],
            "audio_streams": [],
            "data_streams": []
        }
        
        try:
            with open(log_file, 'r') as f:
                content = f.read()
            
            # Extract stream information
            stream_pattern = r'Stream #(\d+):(\d+)(?:\:\d+)?:\s+(\w+):\s*([^[]+)(?:\[([^\]]+)\])?'
            matches = re.findall(stream_pattern, content)
            
            for match in matches:
                stream_index, substream_index, stream_type, details, codec_info = match
                
                stream_info = {
                    "stream_id": f"{stream_index}:{substream_index}",
                    "type": stream_type,
                    "details": details.strip(),
                    "codec_info": codec_info if codec_info else None,
                    "is_scte35": False
                }
                
                # Check if this is a SCTE-35 data stream
                if stream_type.lower() == "data" and "none" in details.lower():
                    stream_info["is_scte35"] = True
                    streams_info["scte35_detected"] = True
                    streams_info["scte35_streams"].append(stream_info)
                    streams_info["data_streams"].append(stream_info)
                elif stream_type.lower() == "video":
                    streams_info["video_streams"].append(stream_info)
                elif stream_type.lower() == "audio":
                    streams_info["audio_streams"].append(stream_info)
                else:
                    streams_info["data_streams"].append(stream_info)
                
                streams_info["streams"].append(stream_info)
            
            # Extract additional SCTE-35 information
            self._extract_scte35_details(content, streams_info)
            
        except Exception as e:
            print(f"❌ Error parsing FFmpeg output: {e}")
        
        return streams_info
    
    def _extract_scte35_details(self, content, streams_info):
        """Extract additional SCTE-35 specific details"""
        # Look for SCTE-35 related information
        scte35_patterns = [
            r'scte35',
            r'scte-35',
            r'pid.*500',
            r'data.*stream',
            r'splice',
            r'cue'
        ]
        
        scte35_details = []
        for pattern in scte35_patterns:
            matches = re.findall(pattern, content, re.IGNORECASE)
            if matches:
                scte35_details.extend(matches)
        
        if scte35_details:
            streams_info["scte35_details"] = list(set(scte35_details))
    
    def _generate_report(self, streams_info):
        """Generate a detailed report of the stream analysis"""
        print(f"📊 Stream Analysis Report")
        print("=" * 60)
        
        # Basic information
        print(f"📥 Input URL: {streams_info['input_url']}")
        print(f"🕒 Analysis Time: {streams_info['analysis_time']}")
        print(f"🔢 Total Streams: {len(streams_info['streams'])}")
        print()
        
        # SCTE-35 Detection Status
        scte_status = "✅ DETECTED" if streams_info["scte35_detected"] else "❌ NOT DETECTED"
        print(f"🎯 SCTE-35 Status: {scte_status}")
        
        if streams_info["scte35_detected"]:
            print(f"📄 SCTE-35 Streams: {len(streams_info['scte35_streams'])}")
            for stream in streams_info["scte35_streams"]:
                print(f"   └─ Stream {stream['stream_id']}: {stream['details']}")
                if stream.get("codec_info"):
                    print(f"      Codec: {stream['codec_info']}")
        
        print()
        
        # Video Streams
        print(f"🎥 Video Streams: {len(streams_info['video_streams'])}")
        for stream in streams_info["video_streams"]:
            print(f"   └─ Stream {stream['stream_id']}: {stream['details']}")
            if stream.get("codec_info"):
                print(f"      Codec: {stream['codec_info']}")
        
        print()
        
        # Audio Streams
        print(f"🔊 Audio Streams: {len(streams_info['audio_streams'])}")
        for stream in streams_info["audio_streams"]:
            print(f"   └─ Stream {stream['stream_id']}: {stream['details']}")
            if stream.get("codec_info"):
                print(f"      Codec: {stream['codec_info']}")
        
        print()
        
        # Data Streams
        print(f"📊 Data Streams: {len(streams_info['data_streams'])}")
        for stream in streams_info["data_streams"]:
            scte_marker = " 🎯 (SCTE-35)" if stream["is_scte35"] else ""
            print(f"   └─ Stream {stream['stream_id']}: {stream['details']}{scte_marker}")
            if stream.get("codec_info"):
                print(f"      Codec: {stream['codec_info']}")
        
        print()
        
        # Additional SCTE-35 details
        if streams_info.get("scte35_details"):
            print(f"🔍 Additional SCTE-35 Details:")
            for detail in streams_info["scte35_details"]:
                print(f"   └─ {detail}")
            print()
        
        # Recommendations
        self._generate_recommendations(streams_info)
        
        # Save detailed report
        self._save_detailed_report(streams_info)
    
    def _generate_recommendations(self, streams_info):
        """Generate recommendations based on the analysis"""
        print(f"💡 Recommendations:")
        print("=" * 60)
        
        if streams_info["scte35_detected"]:
            print("✅ SCTE-35 stream detected - Ready for pass-through encoding")
            print("   • Use -scte35_from_stream true for pass-through")
            print("   • Map data stream explicitly: -map 0:d:0")
            print("   • Set appropriate SCTE-35 PID (default: 500)")
        else:
            print("⚠️  No SCTE-35 stream detected")
            print("   • SCTE-35 can still be generated if needed")
            print("   • Use -scte35_from_stream true for generation")
            print("   • Consider injecting SCTE-35 markers via sidecar")
        
        print()
        
        # Stream mapping recommendations
        print("📋 Recommended Stream Mapping:")
        video_count = len(streams_info["video_streams"])
        audio_count = len(streams_info["audio_streams"])
        
        if video_count > 0:
            print(f"   • Video: -map 0:v:0 (first video stream)")
        if audio_count > 0:
            print(f"   • Audio: -map 0:a:0 (first audio stream)")
        if streams_info["scte35_detected"]:
            print(f"   • SCTE-35: -map 0:d:0 (first data stream)")
        
        print()
        
        # FFmpeg command suggestion
        print("🛠️  Suggested FFmpeg Command:")
        print("ffmpeg -i INPUT_URL \\")
        print("    -c:v libx264 -preset high -b:v 5000k \\")
        print("    -c:a aac -b:a 128k \\")
        
        if streams_info["scte35_detected"]:
            print("    -scte35_from_stream true \\")
            print("    -scte35_pid 500 \\")
            print("    -map 0:v:0 -map 0:a:0 -map 0:d:0 \\")
        else:
            print("    -map 0:v:0 -map 0:a:0 \\")
        
        print("    -f mpegts OUTPUT_URL")
        print()
    
    def _save_detailed_report(self, streams_info):
        """Save detailed report to JSON file"""
        report_file = self.log_dir / f"scte35_analysis_{self.session_id}.json"
        
        try:
            with open(report_file, 'w') as f:
                json.dump(streams_info, f, indent=2)
            
            print(f"📄 Detailed report saved to: {report_file}")
        except Exception as e:
            print(f"❌ Error saving report: {e}")

def main():
    if len(sys.argv) < 2:
        print("Usage: python3 scte35_analyzer.py <input_url>")
        print("Example: python3 scte35_analyzer.py srt://input.example.com:9999?streamid=live1")
        sys.exit(1)
    
    input_url = sys.argv[1]
    analyzer = SCTE35Analyzer(input_url)
    
    print("🎬 SCTE-35 Stream Analyzer")
    print("=" * 60)
    
    streams_info = analyzer.analyze_streams()
    
    if streams_info:
        print("✅ Analysis completed successfully!")
    else:
        print("❌ Analysis failed!")
        sys.exit(1)

if __name__ == "__main__":
    main()