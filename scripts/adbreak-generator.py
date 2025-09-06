#!/usr/bin/env python3
"""
Ad Break Generator using adbreak3
Fast SCTE-35 Sidecar File Generator
"""

import argparse
import json
import logging
import sys
from datetime import datetime, timedelta
from pathlib import Path
import adbreak3

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

class AdBreakGenerator:
    def __init__(self):
        self.output_dir = Path("/var/www/hls")
        self.log_dir = Path("/app/logs")
        
    def generate_sidecar_file(self, ad_breaks, output_file=None):
        """Generate SCTE-35 sidecar file using adbreak3"""
        try:
            if output_file is None:
                output_file = self.output_dir / f"adbreak_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
            
            # Convert ad breaks to adbreak3 format
            adbreak_data = []
            
            for ad_break in ad_breaks:
                # Calculate start time in seconds from reference
                start_time = self.parse_scheduled_time(ad_break['scheduled_time'])
                
                adbreak_data.append({
                    'start': start_time,
                    'duration': ad_break['duration'],
                    'ad_id': ad_break['ad_id'],
                    'cue_type': 'splice_insert',
                    'auto_return': True,
                    'provider_id': ad_break.get('provider_id', '0x1'),
                    'provider_name': ad_break.get('provider_name', 'YourProvider'),
                    'name': ad_break.get('name', f"Ad Break {ad_break['ad_id']}")
                })
            
            # Use adbreak3 to generate sidecar file
            sidecar_file = adbreak3.generate_sidecar(
                adbreak_data,
                str(output_file),
                provider_id='0x1',
                provider_name='YourProvider'
            )
            
            logger.info(f"Generated SCTE-35 sidecar file: {sidecar_file}")
            return sidecar_file
            
        except Exception as e:
            logger.error(f"Error generating sidecar file: {e}")
            raise
    
    def generate_scte35_cues(self, ad_breaks, output_file=None):
        """Generate SCTE-35 cues from ad breaks"""
        try:
            if output_file is None:
                output_file = self.output_dir / f"cues_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
            
            # Generate cues using adbreak3
            cues = []
            
            for ad_break in ad_breaks:
                start_time = self.parse_scheduled_time(ad_break['scheduled_time'])
                
                cue = adbreak3.create_splice_insert(
                    start_time=start_time,
                    duration=ad_break['duration'],
                    ad_id=ad_break['ad_id'],
                    provider_id=ad_break.get('provider_id', '0x1'),
                    provider_name=ad_break.get('provider_name', 'YourProvider')
                )
                
                cues.append({
                    'ad_break_id': ad_break['id'],
                    'cue': cue,
                    'start_time': start_time,
                    'duration': ad_break['duration'],
                    'ad_id': ad_break['ad_id']
                })
            
            # Save cues to file
            with open(output_file, 'w') as f:
                json.dump(cues, f, indent=2, default=str)
            
            logger.info(f"Generated {len(cues)} SCTE-35 cues: {output_file}")
            return output_file
            
        except Exception as e:
            logger.error(f"Error generating SCTE-35 cues: {e}")
            raise
    
    def schedule_ad_breaks(self, ad_breaks, reference_time=None):
        """Schedule ad breaks with timing information"""
        try:
            if reference_time is None:
                reference_time = datetime.now()
            
            scheduled_breaks = []
            
            for ad_break in ad_breaks:
                scheduled_time = self.parse_scheduled_time(ad_break['scheduled_time'])
                
                # Calculate time from reference
                time_from_reference = (scheduled_time - reference_time).total_seconds()
                
                if time_from_reference < 0:
                    logger.warning(f"Ad break {ad_break['id']} is in the past, skipping")
                    continue
                
                scheduled_breaks.append({
                    'id': ad_break['id'],
                    'scheduled_time': scheduled_time,
                    'time_from_reference': time_from_reference,
                    'duration': ad_break['duration'],
                    'ad_id': ad_break['ad_id'],
                    'name': ad_break.get('name'),
                    'provider_id': ad_break.get('provider_id', '0x1'),
                    'provider_name': ad_break.get('provider_name', 'YourProvider')
                })
            
            # Sort by scheduled time
            scheduled_breaks.sort(key=lambda x: x['time_from_reference'])
            
            logger.info(f"Scheduled {len(scheduled_breaks)} ad breaks")
            return scheduled_breaks
            
        except Exception as e:
            logger.error(f"Error scheduling ad breaks: {e}")
            raise
    
    def parse_scheduled_time(self, time_str):
        """Parse scheduled time string to datetime"""
        try:
            # Try different time formats
            formats = [
                '%Y-%m-%dT%H:%M:%S.%fZ',
                '%Y-%m-%dT%H:%M:%SZ',
                '%Y-%m-%d %H:%M:%S',
                '%Y-%m-%d %H:%M'
            ]
            
            for fmt in formats:
                try:
                    return datetime.strptime(time_str, fmt)
                except ValueError:
                    continue
            
            # If no format matches, assume it's a relative time in seconds
            seconds = float(time_str)
            return datetime.now() + timedelta(seconds=seconds)
            
        except Exception as e:
            logger.error(f"Error parsing scheduled time '{time_str}': {e}")
            raise
    
    def validate_ad_breaks(self, ad_breaks):
        """Validate ad break configuration"""
        try:
            errors = []
            
            for i, ad_break in enumerate(ad_breaks):
                # Check required fields
                if 'id' not in ad_break:
                    errors.append(f"Ad break {i}: Missing 'id' field")
                
                if 'scheduled_time' not in ad_break:
                    errors.append(f"Ad break {i}: Missing 'scheduled_time' field")
                
                if 'duration' not in ad_break:
                    errors.append(f"Ad break {i}: Missing 'duration' field")
                
                if 'ad_id' not in ad_break:
                    errors.append(f"Ad break {i}: Missing 'ad_id' field")
                
                # Validate duration
                if 'duration' in ad_break and ad_break['duration'] <= 0:
                    errors.append(f"Ad break {i}: Duration must be positive")
                
                # Validate scheduled time
                if 'scheduled_time' in ad_break:
                    try:
                        self.parse_scheduled_time(ad_break['scheduled_time'])
                    except Exception as e:
                        errors.append(f"Ad break {i}: Invalid scheduled time - {e}")
            
            if errors:
                logger.error(f"Ad break validation errors: {errors}")
                raise ValueError(f"Ad break validation failed: {errors}")
            
            logger.info(f"Validated {len(ad_breaks)} ad breaks")
            return True
            
        except Exception as e:
            logger.error(f"Error validating ad breaks: {e}")
            raise

def main():
    parser = argparse.ArgumentParser(description='Ad Break Generator using adbreak3')
    subparsers = parser.add_subparsers(dest='command', help='Available commands')
    
    # Generate sidecar command
    sidecar_parser = subparsers.add_parser('sidecar', help='Generate SCTE-35 sidecar file')
    sidecar_parser.add_argument('ad_breaks_file', help='Ad breaks JSON file')
    sidecar_parser.add_argument('--output', help='Output file path')
    sidecar_parser.add_argument('--reference-time', help='Reference time (ISO format)')
    
    # Generate cues command
    cues_parser = subparsers.add_parser('cues', help='Generate SCTE-35 cues')
    cues_parser.add_argument('ad_breaks_file', help='Ad breaks JSON file')
    cues_parser.add_argument('--output', help='Output file path')
    
    # Schedule command
    schedule_parser = subparsers.add_parser('schedule', help='Schedule ad breaks')
    schedule_parser.add_argument('ad_breaks_file', help='Ad breaks JSON file')
    schedule_parser.add_argument('--reference-time', help='Reference time (ISO format)')
    schedule_parser.add_argument('--output', help='Output file path')
    
    # Validate command
    validate_parser = subparsers.add_parser('validate', help='Validate ad breaks')
    validate_parser.add_argument('ad_breaks_file', help='Ad breaks JSON file')
    
    args = parser.parse_args()
    
    if not args.command:
        parser.print_help()
        sys.exit(1)
    
    generator = AdBreakGenerator()
    
    try:
        # Load ad breaks
        with open(args.ad_breaks_file, 'r') as f:
            ad_breaks = json.load(f)
        
        if args.command == 'sidecar':
            reference_time = None
            if args.reference_time:
                reference_time = datetime.fromisoformat(args.reference_time.replace('Z', '+00:00'))
            
            scheduled_breaks = generator.schedule_ad_breaks(ad_breaks, reference_time)
            output = generator.generate_sidecar_file(scheduled_breaks, args.output)
            print(f"Generated sidecar file: {output}")
        
        elif args.command == 'cues':
            output = generator.generate_scte35_cues(ad_breaks, args.output)
            print(f"Generated SCTE-35 cues: {output}")
        
        elif args.command == 'schedule':
            reference_time = None
            if args.reference_time:
                reference_time = datetime.fromisoformat(args.reference_time.replace('Z', '+00:00'))
            
            scheduled_breaks = generator.schedule_ad_breaks(ad_breaks, reference_time)
            
            output = args.output or f"/tmp/scheduled_breaks_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
            with open(output, 'w') as f:
                json.dump(scheduled_breaks, f, indent=2, default=str)
            
            print(f"Scheduled ad breaks: {output}")
        
        elif args.command == 'validate':
            generator.validate_ad_breaks(ad_breaks)
            print("Ad breaks validation passed")
    
    except Exception as e:
        logger.error(f"Error executing command '{args.command}': {e}")
        sys.exit(1)

if __name__ == '__main__':
    main()