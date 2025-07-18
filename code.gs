/**
 * Google Apps Script for handling form submissions and data management
 * for the United Student Council of Assam website.
 */

// Main spreadsheet ID
var SPREADSHEET_ID = 'YOUR_GOOGLE_SHEET_ID';

// Sheet names
var SHEETS = {
  MEMBERS: 'Members',
  CONTACTS: 'Contacts'
};

/**
 * Handles the join form submission
 */
function handleJoinForm(formData) {
  try {
    var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    var sheet = ss.getSheetByName(SHEETS.MEMBERS);
    
    // Append the new member data
    sheet.appendRow([
      new Date(), // Timestamp
      formData.name,
      formData.email,
      formData.phone,
      formData.college,
      'Pending' // Status
    ]);
    
    // Send confirmation email (optional)
    sendConfirmationEmail(formData);
    
    return {
      success: true,
      message: 'Thank you for joining USCA! We will contact you soon.'
    };
  } catch (error) {
    Logger.log('Error in handleJoinForm: ' + error);
    return {
      success: false,
      message: 'An error occurred. Please try again later.'
    };
  }
}

/**
 * Gets contact information from the sheet
 */
function getContactInfo() {
  try {
    var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    var sheet = ss.getSheetByName(SHEETS.CONTACTS);
    var data = sheet.getDataRange().getValues();
    
    // Skip header row
    data.shift();
    
    var contacts = [];
    data.forEach(function(row) {
      contacts.push({
        name: row[0],
        role: row[1],
        email: row[2],
        phone: row[3]
      });
    });
    
    return {
      success: true,
      contacts: contacts
    };
  } catch (error) {
    Logger.log('Error in getContactInfo: ' + error);
    return {
      success: false,
      message: 'Failed to load contact information'
    };
  }
}

/**
 * Sends confirmation email to new member (optional)
 */
function sendConfirmationEmail(formData) {
  try {
    var subject = 'Thank you for joining USCA';
    var body = `
      Dear ${formData.name},
      
      Thank you for your interest in joining the United Student Council of Assam (USCA).
      We have received your application and will review it shortly.
      
      Here are your details:
      Name: ${formData.name}
      Email: ${formData.email}
      Phone: ${formData.phone}
      College: ${formData.college}
      
      We will contact you soon with more information about the next steps.
      
      Best regards,
      USCA Team
    `;
    
    MailApp.sendEmail({
      to: formData.email,
      subject: subject,
      body: body
    });
    
    return true;
  } catch (error) {
    Logger.log('Error sending confirmation email: ' + error);
    return false;
  }
}

/**
 * For testing purposes - doGet and doPost functions
 */
function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify(getContactInfo()))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  var data = JSON.parse(e.postData.contents);
  var result = {};
  
  if (data.formType === 'join') {
    result = handleJoinForm(data);
  }
  
  return ContentService.createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}
