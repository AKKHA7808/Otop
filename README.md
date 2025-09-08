# OTOP Thailand Web Application

A web application to display and search OTOP (One Tambon One Product) information from Thailand, featuring Google Maps integration for location visualization.

![OTOP Thailand Application](https://github.com/user-attachments/assets/fb92e94c-6e6b-48cb-a90f-b3bb5850a0dd)

## Features

- **Data Conversion**: Convert CSV data to JSON format
- **Web Interface**: Clean, responsive web interface for browsing OTOP products
- **Search & Filter**: Search by product name, description, or location
- **Category Filtering**: Filter products by category (Textile, Food & Beverage, Handicraft)
- **Province Filtering**: Filter products by Thai provinces
- **Product Details**: View detailed information including contact details
- **Google Maps Integration**: Display product locations on an interactive map
- **Responsive Design**: Works on desktop and mobile devices

## Project Structure

```
├── app.py                 # Flask web application
├── convert_to_json.py     # CSV to JSON conversion script
├── otop_data.csv         # Sample OTOP data in CSV format
├── otop_data.json        # OTOP data in JSON format
├── requirements.txt      # Python dependencies
├── templates/
│   └── index.html        # Main web page template
└── static/
    ├── css/
    │   └── style.css     # Application styles
    └── js/
        └── app.js        # Frontend JavaScript
```

## Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/AKKHA7808/Otop.git
   cd Otop
   ```

2. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Convert CSV data to JSON** (if needed):
   ```bash
   python convert_to_json.py
   ```

4. **Run the application**:
   ```bash
   python app.py
   ```

5. **Access the application**:
   Open your browser and go to `http://localhost:5000`

## Google Maps Integration

To enable Google Maps functionality:

1. Get a Google Maps API key from the [Google Cloud Console](https://console.cloud.google.com/)
2. Enable the Maps JavaScript API
3. Replace `AIzaSyBroadcastkey123demo` in `templates/index.html` with your actual API key

## API Endpoints

The application provides several REST API endpoints:

- `GET /api/otop` - Get all OTOP products
- `GET /api/otop/<id>` - Get a specific OTOP product by ID
- `GET /api/otop/search?q=<query>&category=<cat>&province=<prov>` - Search products
- `GET /api/categories` - Get all available categories
- `GET /api/provinces` - Get all available provinces

## Usage Examples

### Search for coffee products:
```
GET /api/otop/search?q=coffee
```

### Filter by category:
```
GET /api/otop/search?category=Handicraft
```

### Filter by province:
```
GET /api/otop/search?province=Chiang Mai
```

## Data Format

The OTOP data includes the following fields:
- `id`: Unique identifier
- `name`: Product name
- `category`: Product category
- `description`: Product description
- `province`: Thai province
- `district`: District within province
- `tambon`: Sub-district
- `latitude`: GPS latitude coordinate
- `longitude`: GPS longitude coordinate
- `price`: Product price in Thai Baht
- `contact_phone`: Contact phone number
- `contact_email`: Contact email address

## Sample Data

The application includes 10 sample OTOP products from various Thai provinces, including:
- Khon Kaen Silk Fabric
- Chiang Mai Coffee
- Lampang Ceramic Rooster
- Phetchaburi Palm Sugar
- And more...

## Screenshots

### Main Application Interface
![Main Interface](https://github.com/user-attachments/assets/fb92e94c-6e6b-48cb-a90f-b3bb5850a0dd)

### Filtered Results (Handicraft Category)
![Filtered Results](https://github.com/user-attachments/assets/4fe0c9bb-23dc-4b66-8366-0783f457d1e7)

## Technologies Used

- **Backend**: Python Flask
- **Frontend**: HTML5, CSS3, JavaScript
- **Maps**: Google Maps JavaScript API
- **Data**: JSON for storage, CSV for initial data
- **Styling**: Custom CSS with responsive design

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the MIT License.