#!/usr/bin/env python3
"""
SCTE-35 Tools Utility Script
Provides various SCTE-35 operations using the threefive library
"""

import argparse
import json
import logging
import sys
from datetime import datetime, timedelta
from pathlib import Path
import threefive
import m3ufu

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

class SCTE35Tools:
    def __init__(self):
        self.output_dir = Path("/var/www/hls")
        self.log_dir = Path("/app/logs")
        
    def create_splice_insert(self, ad_break_id, duration, provider_id="0x1", provider_name="YourProvider"):
        """Create a SCTE-35 splice_insert command"""
        try:
            # Create a new SCTE-35 cue
            cue = threefive.Cue()
            
            # Set splice_insert command
            cue.command = threefive.SpliceInsert()
            cue.command.splice_event_id = int(ad_break_id.replace('ad', ''))
            cue.command.splice_event_cancel_indicator = False
            cue.command.out_of_network_indicator = True
            cue.command.program_splice_flag = True
            cue.command.duration_flag = True
            cue.command.splice_immediate_flag = False
            
            # Set break duration
            cue.command.break_duration = threefive.BreakDuration()
            cue.command.break_duration.auto_return = True
            cue.command.break_duration.duration = duration * 90000  # Convert to 90kHz clock
            
            # Set descriptors
            cue.command.avail_num = 1
            cue.command.avails_expected = 1
            
            # Encode the cue
            cue.encode()
            
            logger.info(f"Created SCTE-35 splice_insert for ad break {ad_break_id}")
            return cue
            
        except Exception as e:
            logger.error(f"Error creating splice_insert: {e}")
            raise
    
    def create_time_signal(self, ad_break_id, duration, provider_id="0x1", provider_name="YourProvider"):
        """Create a SCTE-35 time_signal command"""
        try:
            # Create a new SCTE-35 cue
            cue = threefive.Cue()
            
            # Set time_signal command
            cue.command = threefive.TimeSignal()
            cue.command.splice_event_id = int(ad_break_id.replace('ad', ''))
            cue.command.splice_event_cancel_indicator = False
            cue.command.out_of_network_indicator = True
            cue.command.program_splice_flag = True
            cue.command.duration_flag = True
            cue.command.splice_immediate_flag = False
            
            # Set break duration
            cue.command.break_duration = threefive.BreakDuration()
            cue.command.break_duration.auto_return = True
            cue.command.break_duration.duration = duration * 90000  # Convert to 90kHz clock
            
            # Encode the cue
            cue.encode()
            
            logger.info(f"Created SCTE-35 time_signal for ad break {ad_break_id}")
            return cue
            
        except Exception as e:
            logger.error(f"Error creating time_signal: {e}")
            raise
    
    def parse_scte35_from_mpegts(self, input_file):
        """Parse SCTE-35 cues from MPEG-TS file"""
        try:
            cues = []
            stream = threefive.Stream(input_file)
            
            for cue in stream.decode():
                cues.append({
                    'cue': cue,
                    'packet_number': cue.packet_number,
                    'pid': cue.pid,
                    'command_type': type(cue.command).__name__,
                    'splice_event_id': getattr(cue.command, 'splice_event_id', None),
                    'out_of_network': getattr(cue.command, 'out_of_network_indicator', None),
                    'duration': getattr(cue.command, 'break_duration.duration', 0) / 90000 if hasattr(cue.command, 'break_duration') else 0
                })
            
            logger.info(f"Parsed {len(cues)} SCTE-35 cues from {input_file}")
            return cues
            
        except Exception as e:
            logger.error(f"Error parsing SCTE-35 from MPEG-TS: {e}")
            raise
    
    def parse_scte35_from_hls(self, m3u8_url):
        """Parse SCTE-35 cues from HLS playlist"""
        try:
            # Use m3ufu to parse HLS playlist with SCTE-35 support
            parser = m3ufu.parse(m3u8_url)
            
            cues = []
            for segment in parser.segments:
                if hasattr(segment, 'scte35') and segment.scte35:
                    cues.append({
                        'segment': segment.uri,
                        'duration': segment.duration,
                        'scte35_data': segment.scte35,
                        'cue': threefive.Cue(segment.scte35)
                    })
            
            logger.info(f"Parsed {len(cues)} SCTE-35 cues from HLS playlist")
            return cues
            
        except Exception as e:
            logger.error(f"Error parsing SCTE-35 from HLS: {e}")
            raise
    
    def inject_scte35_into_hls(self, m3u8_file, scte35_cues, output_file=None):
        """Inject SCTE-35 cues into HLS playlist"""
        try:
            if output_file is None:
                output_file = m3u8_file.replace('.m3u8', '_scte35.m3u8')
            
            # Parse the original playlist
            parser = m3ufu.parse(m3u8_file)
            
            # Inject SCTE-35 cues at appropriate segments
            for i, cue in enumerate(scte35_cues):
                if i < len(parser.segments):
                    parser.segments[i].scte35 = cue.encode()
            
            # Write the modified playlist
            with open(output_file, 'w') as f:
                f.write(str(parser))
            
            logger.info(f"Injected {len(scte35_cues)} SCTE-35 cues into {output_file}")
            return output_file
            
        except Exception as e:
            logger.error(f"Error injecting SCTE-35 into HLS: {e}")
            raise
    
    def generate_sidecar_file(self, ad_breaks, output_file=None):
        """Generate SCTE-35 sidecar file using adbreak3"""
        try:
            if output_file is None:
                output_file = self.output_dir / f"sidecar_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
            
            # Convert ad breaks to sidecar format
            sidecar_data = {
                'version': '1.0',
                'provider_id': '0x1',
                'provider_name': 'YourProvider',
                'ad_breaks': []
            }
            
            for ad_break in ad_breaks:
                sidecar_data['ad_breaks'].append({
                    'id': ad_break['id'],
                    'scheduled_time': ad_break['scheduled_time'],
                    'duration': ad_break['duration'],
                    'ad_id': ad_break['ad_id'],
                    'cue_type': 'splice_insert',
                    'auto_return': True,
                    'provider_id': ad_break.get('provider_id', '0x1'),
                    'provider_name': ad_break.get('provider_name', 'YourProvider')
                })
            
            # Write sidecar file
            with open(output_file, 'w') as f:
                json.dump(sidecar_data, f, indent=2)
            
            logger.info(f"Generated SCTE-35 sidecar file: {output_file}")
            return output_file
            
        except Exception as e:
            logger.error(f"Error generating sidecar file: {e}")
            raise

def main():
    parser = argparse.ArgumentParser(description='SCTE-35 Tools Utility')
    subparsers = parser.add_subparsers(dest='command', help='Available commands')
    
    # Create splice_insert command
    splice_parser = subparsers.add_parser('splice_insert', help='Create SCTE-35 splice_insert')
    splice_parser.add_argument('--ad-break-id', required=True, help='Ad break ID')
    splice_parser.add_argument('--duration', type=int, required=True, help='Duration in seconds')
    splice_parser.add_argument('--provider-id', default='0x1', help='Provider ID')
    splice_parser.add_argument('--provider-name', default='YourProvider', help='Provider name')
    splice_parser.add_argument('--output', help='Output file path')
    
    # Create time_signal command
    time_parser = subparsers.add_parser('time_signal', help='Create SCTE-35 time_signal')
    time_parser.add_argument('--ad-break-id', required=True, help='Ad break ID')
    time_parser.add_argument('--duration', type=int, required=True, help='Duration in seconds')
    time_parser.add_argument('--provider-id', default='0x1', help='Provider ID')
    time_parser.add_argument('--provider-name', default='YourProvider', help='Provider name')
    time_parser.add_argument('--output', help='Output file path')
    
    # Parse MPEG-TS command
    parse_ts_parser = subparsers.add_parser('parse_ts', help='Parse SCTE-35 from MPEG-TS')
    parse_ts_parser.add_argument('input_file', help='Input MPEG-TS file')
    parse_ts_parser.add_argument('--output', help='Output JSON file')
    
    # Parse HLS command
    parse_hls_parser = subparsers.add_parser('parse_hls', help='Parse SCTE-35 from HLS')
    parse_hls_parser.add_argument('m3u8_url', help='HLS playlist URL')
    parse_hls_parser.add_argument('--output', help='Output JSON file')
    
    # Inject HLS command
    inject_parser = subparsers.add_parser('inject_hls', help='Inject SCTE-35 into HLS')
    inject_parser.add_argument('m3u8_file', help='Input HLS playlist file')
    inject_parser.add_argument('scte35_file', help='SCTE-35 cues JSON file')
    inject_parser.add_argument('--output', help='Output file path')
    
    # Generate sidecar command
    sidecar_parser = subparsers.add_parser('sidecar', help='Generate SCTE-35 sidecar file')
    sidecar_parser.add_argument('ad_breaks_file', help='Ad breaks JSON file')
    sidecar_parser.add_argument('--output', help='Output file path')
    
    args = parser.parse_args()
    
    if not args.command:
        parser.print_help()
        sys.exit(1)
    
    tools = SCTE35Tools()
    
    try:
        if args.command == 'splice_insert':
            cue = tools.create_splice_insert(
                args.ad_break_id,
                args.duration,
                args.provider_id,
                args.provider_name
            )
            output = args.output or f"/tmp/splice_insert_{args.ad_break_id}.cue"
            with open(output, 'wb') as f:
                f.write(cue.encode())
            print(f"Created splice_insert: {output}")
        
        elif args.command == 'time_signal':
            cue = tools.create_time_signal(
                args.ad_break_id,
                args.duration,
                args.provider_id,
                args.provider_name
            )
            output = args.output or f"/tmp/time_signal_{args.ad_break_id}.cue"
            with open(output, 'wb') as f:
                f.write(cue.encode())
            print(f"Created time_signal: {output}")
        
        elif args.command == 'parse_ts':
            cues = tools.parse_scte35_from_mpegts(args.input_file)
            output = args.output or f"/tmp/parsed_cues_{Path(args.input_file).stem}.json"
            with open(output, 'w') as f:
                json.dump(cues, f, indent=2, default=str)
            print(f"Parsed {len(cues)} cues: {output}")
        
        elif args.command == 'parse_hls':
            cues = tools.parse_scte35_from_hls(args.m3u8_url)
            output = args.output or f"/tmp/hls_cues_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
            with open(output, 'w') as f:
                json.dump(cues, f, indent=2, default=str)
            print(f"Parsed {len(cues)} cues: {output}")
        
        elif args.command == 'inject_hls':
            with open(args.scte35_file, 'r') as f:
                scte35_data = json.load(f)
            cues = [threefive.Cue(cue_data) for cue_data in scte35_data['cues']]
            output = tools.inject_scte35_into_hls(args.m3u8_file, cues, args.output)
            print(f"Injected SCTE-35 cues: {output}")
        
        elif args.command == 'sidecar':
            with open(args.ad_breaks_file, 'r') as f:
                ad_breaks = json.load(f)
            output = tools.generate_sidecar_file(ad_breaks, args.output)
            print(f"Generated sidecar file: {output}")
    
    except Exception as e:
        logger.error(f"Error executing command '{args.command}': {e}")
        sys.exit(1)

if __name__ == '__main__':
    main()