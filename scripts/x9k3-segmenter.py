#!/usr/bin/env python3
"""
X9k3 HLS Segmenter with SCTE-35 Injection
Uses the x9k3 library for ABR HLS segmentation with SCTE-35 support
"""

import argparse
import json
import logging
import sys
from datetime import datetime
from pathlib import Path
import x9k3
import threefive

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

class X9k3Segmenter:
    def __init__(self):
        self.output_dir = Path("/var/www/hls")
        self.log_dir = Path("/app/logs")
        
    def create_segmenter_config(self, input_url, output_name, bitrates, resolutions, scte35_enabled=True):
        """Create x9k3 segmenter configuration"""
        try:
            config = {
                'input': input_url,
                'output': str(self.output_dir / output_name),
                'segments': 6,
                'segment_duration': 6,
                'playlist_size': 5,
                'delete_segments': True,
                'scte35': scte35_enabled,
                'streams': []
            }
            
            # Add bitrate variants
            for bitrate, resolution in zip(bitrates, resolutions):
                config['streams'].append({
                    'bitrate': bitrate,
                    'resolution': resolution,
                    'audio_bitrate': 128
                })
            
            logger.info(f"Created x9k3 configuration for {output_name}")
            return config
            
        except Exception as e:
            logger.error(f"Error creating segmenter config: {e}")
            raise
    
    def start_segmentation(self, config_file, session_id=None):
        """Start HLS segmentation with x9k3"""
        try:
            if session_id is None:
                session_id = datetime.now().strftime('%Y%m%d_%H%M%S')
            
            # Load configuration
            with open(config_file, 'r') as f:
                config = json.load(f)
            
            # Create x9k3 segmenter
            segmenter = x9k3.Segmenter(
                input_uri=config['input'],
                output_dir=config['output'],
                segments=config['segments'],
                segment_duration=config['segment_duration'],
                playlist_size=config['playlist_size'],
                delete_segments=config['delete_segments'],
                scte35=config['scte35']
            )
            
            # Add stream variants
            for stream in config['streams']:
                segmenter.add_stream(
                    bitrate=stream['bitrate'],
                    resolution=stream['resolution'],
                    audio_bitrate=stream['audio_bitrate']
                )
            
            # Start segmentation
            logger.info(f"Starting x9k3 segmentation for session {session_id}")
            segmenter.start()
            
            return segmenter
            
        except Exception as e:
            logger.error(f"Error starting segmentation: {e}")
            raise
    
    def inject_scte35_markers(self, m3u8_file, scte35_markers, output_file=None):
        """Inject SCTE-35 markers into HLS playlist"""
        try:
            if output_file is None:
                output_file = m3u8_file.replace('.m3u8', '_scte35.m3u8')
            
            # Parse the playlist
            with open(m3u8_file, 'r') as f:
                playlist_content = f.read()
            
            # Inject SCTE-35 markers
            # This is a simplified version - in production, you'd use x9k3's built-in SCTE-35 support
            modified_content = playlist_content
            
            for marker in scte35_markers:
                # Find the appropriate segment to inject the marker
                # This would need more sophisticated timing logic
                scte35_tag = f'#EXT-X-SCTE35:{marker["data"]}\n'
                modified_content = modified_content.replace('#EXTINF:', scte35_tag + '#EXTINF:')
            
            # Write the modified playlist
            with open(output_file, 'w') as f:
                f.write(modified_content)
            
            logger.info(f"Injected {len(scte35_markers)} SCTE-35 markers into {output_file}")
            return output_file
            
        except Exception as e:
            logger.error(f"Error injecting SCTE-35 markers: {e}")
            raise
    
    def create_master_playlist(self, variant_playlists, output_file):
        """Create master playlist with variant streams"""
        try:
            master_content = "#EXTM3U\n"
            master_content += "#EXT-X-VERSION:3\n"
            
            for variant in variant_playlists:
                master_content += f'#EXT-X-STREAM-INF:BANDWIDTH={variant["bandwidth"]},RESOLUTION={variant["resolution"]}\n'
                master_content += f'{variant["uri"]}\n'
            
            with open(output_file, 'w') as f:
                f.write(master_content)
            
            logger.info(f"Created master playlist: {output_file}")
            return output_file
            
        except Exception as e:
            logger.error(f"Error creating master playlist: {e}")
            raise
    
    def generate_scte35_markers(self, ad_breaks):
        """Generate SCTE-35 markers for ad breaks"""
        try:
            markers = []
            
            for ad_break in ad_breaks:
                # Create splice_insert marker
                cue = threefive.Cue()
                cue.command = threefive.SpliceInsert()
                cue.command.splice_event_id = int(ad_break['id'].replace('ad', ''))
                cue.command.splice_event_cancel_indicator = False
                cue.command.out_of_network_indicator = True
                cue.command.program_splice_flag = True
                cue.command.duration_flag = True
                cue.command.splice_immediate_flag = False
                cue.command.break_duration = threefive.BreakDuration()
                cue.command.break_duration.auto_return = True
                cue.command.break_duration.duration = ad_break['duration'] * 90000
                cue.command.avail_num = 1
                cue.command.avails_expected = 1
                
                cue.encode()
                
                markers.append({
                    'id': ad_break['id'],
                    'scheduled_time': ad_break['scheduled_time'],
                    'duration': ad_break['duration'],
                    'data': cue.encode().hex(),
                    'cue': cue
                })
            
            logger.info(f"Generated {len(markers)} SCTE-35 markers")
            return markers
            
        except Exception as e:
            logger.error(f"Error generating SCTE-35 markers: {e}")
            raise

def main():
    parser = argparse.ArgumentParser(description='X9k3 HLS Segmenter with SCTE-35')
    subparsers = parser.add_subparsers(dest='command', help='Available commands')
    
    # Start segmentation command
    start_parser = subparsers.add_parser('start', help='Start HLS segmentation')
    start_parser.add_argument('--input', required=True, help='Input URL')
    start_parser.add_argument('--output', required=True, help='Output name')
    start_parser.add_argument('--bitrates', nargs='+', type=int, default=[1000, 2500, 5000], help='Bitrates in kbps')
    start_parser.add_argument('--resolutions', nargs='+', default=['1280x720', '1920x1080', '1920x1080'], help='Resolutions')
    start_parser.add_argument('--scte35', action='store_true', default=True, help='Enable SCTE-35')
    start_parser.add_argument('--session-id', help='Session ID')
    
    # Create config command
    config_parser = subparsers.add_parser('config', help='Create segmenter configuration')
    config_parser.add_argument('--input', required=True, help='Input URL')
    config_parser.add_argument('--output', required=True, help='Output name')
    config_parser.add_argument('--bitrates', nargs='+', type=int, default=[1000, 2500, 5000], help='Bitrates in kbps')
    config_parser.add_argument('--resolutions', nargs='+', default=['1280x720', '1920x1080', '1920x1080'], help='Resolutions')
    config_parser.add_argument('--scte35', action='store_true', default=True, help='Enable SCTE-35')
    config_parser.add_argument('--config-file', help='Configuration file path')
    
    # Inject SCTE-35 command
    inject_parser = subparsers.add_parser('inject', help='Inject SCTE-35 markers')
    inject_parser.add_argument('m3u8_file', help='HLS playlist file')
    inject_parser.add_argument('ad_breaks_file', help='Ad breaks JSON file')
    inject_parser.add_argument('--output', help='Output file path')
    
    # Create master playlist command
    master_parser = subparsers.add_parser('master', help='Create master playlist')
    master_parser.add_argument('variants', nargs='+', help='Variant playlist files')
    master_parser.add_argument('--output', required=True, help='Output master playlist file')
    
    args = parser.parse_args()
    
    if not args.command:
        parser.print_help()
        sys.exit(1)
    
    segmenter = X9k3Segmenter()
    
    try:
        if args.command == 'start':
            config = segmenter.create_segmenter_config(
                args.input,
                args.output,
                args.bitrates,
                args.resolutions,
                args.scte35
            )
            
            config_file = f"/tmp/x9k3_config_{args.output}.json"
            with open(config_file, 'w') as f:
                json.dump(config, f, indent=2)
            
            segmenter.start_segmentation(config_file, args.session_id)
        
        elif args.command == 'config':
            config = segmenter.create_segmenter_config(
                args.input,
                args.output,
                args.bitrates,
                args.resolutions,
                args.scte35
            )
            
            config_file = args.config_file or f"/tmp/x9k3_config_{args.output}.json"
            with open(config_file, 'w') as f:
                json.dump(config, f, indent=2)
            
            print(f"Created configuration: {config_file}")
        
        elif args.command == 'inject':
            with open(args.ad_breaks_file, 'r') as f:
                ad_breaks = json.load(f)
            
            markers = segmenter.generate_scte35_markers(ad_breaks)
            output = segmenter.inject_scte35_markers(args.m3u8_file, markers, args.output)
            print(f"Injected SCTE-35 markers: {output}")
        
        elif args.command == 'master':
            variants = []
            for variant_file in args.variants:
                # Parse bitrate and resolution from filename (simplified)
                variants.append({
                    'uri': variant_file,
                    'bandwidth': 2500000,  # Default bandwidth
                    'resolution': '1920x1080'  # Default resolution
                })
            
            output = segmenter.create_master_playlist(variants, args.output)
            print(f"Created master playlist: {output}")
    
    except Exception as e:
        logger.error(f"Error executing command '{args.command}': {e}")
        sys.exit(1)

if __name__ == '__main__':
    main()