# United Student Council of Assam Website

This is the official website for the United Student Council of Assam (USCA), a student-led organization dedicated to empowering Manipuri students in Assam.

## Features

- Responsive design for all devices
- Mobile-friendly navigation
- Join form with Google Sheets integration
- Contact information management
- Core pillars section highlighting USCA's mission

## Setup Instructions

1. **Google Sheets Setup**:
   - Create a new Google Sheet with two worksheets: "Members" and "Contacts"
   - Set up columns as described in the documentation
   - Note the Sheet ID from the URL

2. **Google Apps Script**:
   - Create a new script project in Google Apps Script
   - Paste the code from `appsscript/code.gs`
   - Replace `YOUR_GOOGLE_SHEET_ID` with your actual Sheet ID
   - Deploy as a web app with these settings:
     - Execute as: Me
     - Who has access: Anyone, even anonymous

3. **Website Deployment**:
   - Host the HTML, CSS, and JS files on any web hosting service
   - Update the script tags in the HTML to point to your deployed Apps Script web app

## Development

To run locally for development:

1. Clone this repository
2. Open `index.html` in a browser
3. The form will use mock responses without connecting to Google Sheets

## License

This project is for the exclusive use of the United Student Council of Assam.
