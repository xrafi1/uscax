// Configuration
const CONFIG = {
  SPREADSHEET_ID: '1zrCLjFL4vPwgK_EJ8HjAarcqfnQXBV4qLXQDHbwEH8s',
  SHEETS: {
    MEMBERS: 'Members',
    CONTACTS: 'Contacts'
  },
  ADMIN_EMAIL: 'your-email@example.com'
};

// Enhanced error handling for sheet operations
function getSheet(sheetName) {
  try {
    const spreadsheet = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
    if (!spreadsheet) {
      throw new Error(`Spreadsheet not found with ID: ${CONFIG.SPREADSHEET_ID}`);
    }
    
    const sheet = spreadsheet.getSheetByName(sheetName);
    if (!sheet) {
      throw new Error(`Sheet "${sheetName}" not found in spreadsheet`);
    }
    
    return sheet;
  } catch (error) {
    notifyAdmin('Sheet Access Error', error);
    throw error;
  }
}

// Main form processor with validation
function processFormSubmission(formData) {
  const requiredFields = ['name', 'email', 'college'];
  const missingFields = requiredFields.filter(field => !formData[field]);
  
  if (missingFields.length > 0) {
    throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    throw new Error('Invalid email format');
  }

  const sheet = getSheet(CONFIG.SHEETS.MEMBERS);
  const timestamp = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "yyyy-MM-dd HH:mm:ss");
  
  sheet.appendRow([
    timestamp,
    formData.name.trim(),
    formData.email.trim(),
    formData.phone ? formData.phone.trim() : '',
    formData.college.trim(),
    'New'
  ]);
  
  return { success: true, message: 'Submission successful' };
}

// Web app endpoints
function doPost(e) {
  let response;
  
  try {
    const data = JSON.parse(e.postData.contents);
    response = processFormSubmission(data);
  } catch (error) {
    response = {
      success: false,
      message: error.message,
      errorDetails: error.stack
    };
  }
  
  return ContentService
    .createTextOutput(JSON.stringify(response))
    .setMimeType(ContentService.MimeType.JSON)
    .addHeader("Access-Control-Allow-Origin", "*");
}

function doGet() {
  try {
    const contacts = getContacts();
    return ContentService
      .createTextOutput(JSON.stringify({ success: true, contacts }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ 
        success: false, 
        message: 'Failed to load contacts'
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Helper functions
function getContacts() {
  const sheet = getSheet(CONFIG.SHEETS.CONTACTS);
  return sheet.getDataRange()
    .getValues()
    .slice(1) // Skip header
    .map(row => ({
      name: row[0] || '',
      role: row[1] || '',
      email: row[2] || '',
      phone: row[3] || ''
    }));
}

function notifyAdmin(subject, error) {
  MailApp.sendEmail(CONFIG.ADMIN_EMAIL,
    `USCA Error: ${subject}`,
    `Error Details:\n\n${error.message}\n\n${error.stack}\n\nSpreadsheet ID: ${CONFIG.SPREADSHEET_ID}`
  );
}
