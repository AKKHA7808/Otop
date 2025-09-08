#!/usr/bin/env python3
"""
OTOP Web Application
A Flask web app to display OTOP (One Tambon One Product) data on Google Maps
"""

from flask import Flask, render_template, jsonify, request
import json
import os

app = Flask(__name__)

# Global variable to store OTOP data
otop_data = []

def load_otop_data():
    """Load OTOP data from JSON file"""
    global otop_data
    try:
        with open('otop_data.json', 'r', encoding='utf-8') as f:
            otop_data = json.load(f)
        print(f"Loaded {len(otop_data)} OTOP records")
    except FileNotFoundError:
        print("Error: otop_data.json not found")
        otop_data = []
    except Exception as e:
        print(f"Error loading data: {str(e)}")
        otop_data = []

@app.route('/')
def index():
    """Main page with Google Maps"""
    return render_template('index.html')

@app.route('/api/otop')
def get_otop_data():
    """API endpoint to get all OTOP data"""
    return jsonify(otop_data)

@app.route('/api/otop/<int:otop_id>')
def get_otop_by_id(otop_id):
    """API endpoint to get specific OTOP by ID"""
    otop_item = next((item for item in otop_data if item['id'] == otop_id), None)
    if otop_item:
        return jsonify(otop_item)
    else:
        return jsonify({'error': 'OTOP not found'}), 404

@app.route('/api/otop/search')
def search_otop():
    """API endpoint to search OTOP data"""
    query = request.args.get('q', '').lower()
    category = request.args.get('category', '')
    province = request.args.get('province', '')
    
    filtered_data = otop_data
    
    # Filter by search query (name, description, or province)
    if query:
        filtered_data = [
            item for item in filtered_data
            if query in item['name'].lower() or 
               query in item['description'].lower() or 
               query in item['province'].lower()
        ]
    
    # Filter by category
    if category:
        filtered_data = [
            item for item in filtered_data
            if item['category'].lower() == category.lower()
        ]
    
    # Filter by province
    if province:
        filtered_data = [
            item for item in filtered_data
            if item['province'].lower() == province.lower()
        ]
    
    return jsonify(filtered_data)

@app.route('/api/categories')
def get_categories():
    """API endpoint to get unique categories"""
    categories = list(set(item['category'] for item in otop_data))
    return jsonify(sorted(categories))

@app.route('/api/provinces')
def get_provinces():
    """API endpoint to get unique provinces"""
    provinces = list(set(item['province'] for item in otop_data))
    return jsonify(sorted(provinces))

if __name__ == '__main__':
    # Load OTOP data on startup
    load_otop_data()
    
    # Run the Flask app
    app.run(debug=True, host='0.0.0.0', port=5000)