#!/usr/bin/env python3
"""
Script to convert OTOP CSV data to JSON format
"""

import csv
import json
import sys
from pathlib import Path

def csv_to_json(csv_file_path, json_file_path):
    """
    Convert CSV file to JSON format
    
    Args:
        csv_file_path (str): Path to input CSV file
        json_file_path (str): Path to output JSON file
    """
    try:
        data = []
        
        # Read CSV file
        with open(csv_file_path, 'r', encoding='utf-8') as csv_file:
            csv_reader = csv.DictReader(csv_file)
            
            for row in csv_reader:
                # Convert numeric fields
                if 'latitude' in row:
                    row['latitude'] = float(row['latitude'])
                if 'longitude' in row:
                    row['longitude'] = float(row['longitude'])
                if 'price' in row:
                    row['price'] = float(row['price'])
                if 'id' in row:
                    row['id'] = int(row['id'])
                
                data.append(row)
        
        # Write JSON file
        with open(json_file_path, 'w', encoding='utf-8') as json_file:
            json.dump(data, json_file, indent=2, ensure_ascii=False)
        
        print(f"Successfully converted {len(data)} records from {csv_file_path} to {json_file_path}")
        return True
        
    except FileNotFoundError:
        print(f"Error: File {csv_file_path} not found")
        return False
    except Exception as e:
        print(f"Error converting file: {str(e)}")
        return False

def main():
    """Main function"""
    # Set default file paths
    csv_file = "otop_data.csv"
    json_file = "otop_data.json"
    
    # Allow command line arguments
    if len(sys.argv) >= 2:
        csv_file = sys.argv[1]
    if len(sys.argv) >= 3:
        json_file = sys.argv[2]
    
    # Check if CSV file exists
    if not Path(csv_file).exists():
        print(f"Error: CSV file '{csv_file}' does not exist")
        sys.exit(1)
    
    # Convert CSV to JSON
    success = csv_to_json(csv_file, json_file)
    
    if success:
        print("Conversion completed successfully!")
    else:
        print("Conversion failed!")
        sys.exit(1)

if __name__ == "__main__":
    main()