const Note = require('../_database_/NoteModel');
const validator = require('../_validators_/validator');

const { google } = require('googleapis');
const key = require('../_loggers_/key');

const auth = new google.auth.GoogleAuth({
    credentials: key,
    scopes: ['https://www.googleapis.com/auth/documents'],
});
  
const docs = google.docs({ version: 'v1', auth });

async function getNotes(req, res, next) {
    try {
        const foundNotes = await Note.find({flag: 1}).exec(); 
        res.send(foundNotes);
        console.log("All notes fetched");           
    } catch(err) {
        console.log("Error while fetching notes:", err);
        err.status = 500;
        next(err);
        // res.status(500).send("An error occurred while fetching notes.");
    }
};


async function getDeletedNotes(req, res, next) {
    try {
        const foundDeletedNotes = await Note.find({flag: 0}).exec();
        res.send(foundDeletedNotes);
        console.log("Deleted notes fetched");
    } catch(err) {
        console.log("Error while fetching notes:", err);
        err.status = 500;
        next(err);
        // res.status(500).send("An error occurred while fetching notes.");
    }
}

async function getArchivedNotes(req, res, next) {
    try {
        const foundArchivedNotes = await Note.find({flag: 2}).exec();
        console.log("Archived notes fetched");
        res.send(foundArchivedNotes); 
    } catch(err) {
        console.log("Error while fetching archived notes:", err);
        err.status = 500;
        next(err);
        // res.status(500).send("An error occurred while fetching archived notes.");
    }
}

async function updateNote(req, res, next) {
    try {
        const { title, details } = req.body.newNote;

        const sanitizedNoteTitle = validator.sanitizeInput(title);
        const sanitizedNoteDetail = validator.sanitizeInput(details);

        const updatedNote = {
            title: sanitizedNoteTitle,
            details: sanitizedNoteDetail
        };

        validator.validateNoteInput(updatedNote, "update");

        await Note.findOneAndUpdate(
            { _id: req.query.id },
            updatedNote,
            { new: true }
          ).exec();

          console.log('Successfully updated note.');
          res.redirect('/');
    } catch(err) {
        console.log("Error while updating note:", err);
        err.status = 500;
        next(err);
        // res.status(500).send("An error occurred while updating the note.");
    }    
}

async function safeDelete(req, res, next) {
    try {
        const id = req.query.id;
        await Note.findByIdAndUpdate({_id: id}, {"flag": 0}).exec();

        console.log("Note deleted");
        res.redirect('/');
    } catch (err) {
        console.log("Error while safe deleting note:", err);
        err.status = 500;
        next(err);
        // res.status(500).send("An error occurred while safe deleting the note.");
    }   
}

async function createNote(req, res, next) {
    try {
        const { title: noteTitle, details: noteDetail, colorId: noteColorId } = req.body;
        
        const sanitizedNoteTitle = validator.sanitizeInput(noteTitle);
        const sanitizedNoteDetail = validator.sanitizeInput(noteDetail);
        const sanitizedNoteColorId = validator.sanitizeInput(noteColorId);

        const newNote = new Note ({
            title: sanitizedNoteTitle,
            details: sanitizedNoteDetail,
            colorId: sanitizedNoteColorId
        });

        validator.validateNoteInput(newNote, "create");
        await newNote.save();

        console.log("Note created successfully.");
        res.redirect('/');
    } catch(err) {
        console.log("Error while creating note:", err);
        err.status = 500;
        next(err);
        // res.status(500).send("An error occurred while creating the note.");
    }    
}

async function archiveNote (req, res, next) {
    try {
        const id = req.query.id;
        await Note.findByIdAndUpdate(id, {flag: 2}).exec();
        console.log("Note archived successfully.");
        res.redirect('/');
    } catch (err) {
        console.log("Error while archiving note:", err);
        err.status = 500;
        next(err);
        // res.status(500).send("An error occurred while archiving the note.");
    }    
}

async function unarchiveNote (req, res, next) {
    try {
        const id = req.query.id;
        await Note.findByIdAndUpdate(id, {flag: 1}).exec();
        console.log("Note unarchived successfully.");
        res.redirect('/');
    } catch(err) {
        console.log("Error while unarchiving note:", err);
        err.status = 500;
        next(err);
        // res.status(500).send("An error occurred while unarchiving the note.");
    }    
}

async function permanentDelete(req, res, next) {
    try {
        const id = req.query.id;
        await Note.findByIdAndDelete(id).exec();
        console.log("Note permanently deleted.");
        res.redirect('/');
    } catch (err) {
        console.log(err);
        next(err);
    }  
}

function invalidRoute (req, res, next) {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
    // res.status(404).json({ error: 'Invalid Page' });
}

// <!-------------Logger methods-------------->

async function getErrorLog(document_id, req) {
    try {
      // Assuming you have stored the document ID somewhere
      const documentId = document_id;
  
      const response = await docs.documents.get({ documentId });
      const documentContent = response.data.body.content;
  
      let errorLog = `Error Log:<br>`;

        // Iterate through the document content and format the text
        documentContent.forEach((content) => {
            if (content.paragraph && content.paragraph.elements) {
                content.paragraph.elements.forEach((element) => {
                    if (element.textRun && element.textRun.content) {
                        errorLog += '&ensp;' + element.textRun.content;
                    }
                    
                });
                
            }
            errorLog += '<br>'
        });

      return (errorLog);
    } catch (error) {
      console.error('Error retrieving error log:', error);
    }
}

async function getRequestLog(document_id, req) {
    try {
      // Assuming you have stored the document ID somewhere
      const documentId = document_id;
  
      const response = await docs.documents.get({ documentId });
      const documentContent = response.data.body.content;
  
      let requestLog = `Request Log: (Default Order is most recent to oldest)<br>`;

        // Iterate through the document content and format the text
        documentContent.forEach((content, index) => {
            if (content.paragraph && content.paragraph.elements) {
                content.paragraph.elements.forEach((element) => {
                    if (element.textRun && element.textRun.content) {
                        requestLog += '&ensp;' + index + ".) " + element.textRun.content;
                    }
                    
                });
                
            }
            requestLog += '<br><br>'
        });

      return (requestLog);
    } catch (error) {
      console.error('Error retrieving request log:', error);
    }
}

module.exports = {
    getNotes,
    getDeletedNotes,
    getArchivedNotes,
    updateNote,
    safeDelete,
    createNote,
    archiveNote,
    unarchiveNote,
    permanentDelete,
    invalidRoute,
    getErrorLog,
    getRequestLog
}
