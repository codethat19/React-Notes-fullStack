//Package imports
require('dotenv').config();
const express = require('express');
const cors = require('cors');

//Module imports
const controllers = require('./_controllers_/controllers.js');
const logger = require('./_loggers_/loggers.js');

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(logger.requestLogger);

//<!--------End user Routes------->
//Get Routes
app.get('/', controllers.getNotes);
app.get('/archived', controllers.getArchivedNotes);
app.get('/deletedNotes', controllers.getDeletedNotes);

//Post Routes
app.post('/create-note', controllers.createNote);
app.post('/update',  controllers.updateNote);
app.post('/deleteNote', controllers.safeDelete);
app.post('/archive', controllers.archiveNote);
app.post('/unarchive', controllers.unarchiveNote);
app.post('/permaDeleteNote', controllers.permanentDelete);

function formatContent(content) {
    let table = 'Field\tValue\n';

    for (const item of content) {
      if (item.paragraph && item.paragraph.elements && item.paragraph.elements.length > 0) {
        const field = '';
        const value = item.paragraph.elements[0].textRun.content.trim();
  
        table += `${field}\t${value}\n`;
      }
    }
  
    return table;
  }

//<!--------Google Docs Log Routes------->
app.get('/errorlog', async (req, res) => {
    const documentContent = await controllers.getErrorLog(process.env.ERROR_DOCUMENT_ID, req);
    res.send(documentContent);
});
app.get('/requestlog', async (req, res) => {
    const documentContent = await controllers.getRequestLog(process.env.REQUEST_DOCUMENT_ID, req);
    res.send(documentContent);
});

//Invalid Route
app.all('/*', controllers.invalidRoute);

//Error logging middleware
app.use(logger.errorLogger);

//Server listen
app.listen(port, () => {
    console.log("Server running at port: " + port);
});