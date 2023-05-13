const fs = require('fs');
const path = require('path');
const { google } = require('googleapis');

const key = require('./key');

const auth = new google.auth.GoogleAuth({
  credentials: key,
  scopes: ['https://www.googleapis.com/auth/documents'],
});

const docs = google.docs({ version: 'v1', auth });

const accessLogPath = path.join(__dirname, 'access.log');
const errorLogPath = path.join(__dirname, 'error.log');

async function requestLogger (req, res, next) {
    const logEntry = `${new Date().toISOString()} - ${req.method} ${req.url} - ${req.ip}\n`;

    // Log the request to a file
    await new Promise((resolve, reject) => {
        fs.appendFile(accessLogPath, logEntry, (error) => {
            if (error) {
                console.error('Failed to write access log:', error);
                reject(error);
            } else {
                resolve();
            }
        });
    });
    const document = {
        title: 'Request Log',
      };
  
    // const response = await docs.documents.create({ resource: document });
    // const documentId = response.data.documentId;
    // console.log(documentId);
    // console.log("Document created successfully")
    const documentId = process.env.REQUEST_DOCUMENT_ID
    const response = await docs.documents.get({documentId});

    try {
        await docs.documents.batchUpdate({
        documentId,
        requestBody: {
          requests: [
            {
              insertText: {
                location: {
                  index: 1,
                },
                text: logEntry,
              },
            },
          ],
        },
      });
    } catch(err) {
        console.log(err);
    }

    next();
}

async function errorLogger(err, req, res, next) {
    // Log the error to a file
    const errorLog = `Error occurred at ${new Date().toISOString()}:\nError code: ${err.status}\nRequest IP:${req.ip}\n${err.stack}\n\n`;
    await new Promise((resolve, reject) => {
        fs.appendFile(errorLogPath, errorLog, (error) => {
            if (error) {
                console.error('Failed to write error log:', error);
                reject(error);
            } else {
                resolve();
            }
        });
    });

    const document = {
        title: 'Error Log',
    };
    const documentId = process.env.ERROR_DOCUMENT_ID
    const response = await docs.documents.get({documentId});
    
    // const documentContent = response.data.body.content;


    // const documentId = response.data.documentId;
    // console.log("Document id: " + documentId);
    // const content = `Error: ${err.message}\nStack Trace:\n${err.stack}`;

    try {
        await docs.documents.batchUpdate({
        documentId,
        requestBody: {
          requests: [
            {
              insertText: {
                location: {
                  index: 1,
                },
                text: errorLog,
              },
            },
          ],
        },
      });
    } catch(err) {
        console.log(err);
    }
  
    console.log('Error logged to Google Docs successfully.');
    res.status(err.status).send('An error occurred');
}

module.exports = {
    requestLogger,
    errorLogger
}
