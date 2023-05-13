const Note = require('../_database_/NoteModel');
const validator = require('../_validators_/validator');

async function getNotes(req, res) {
    try {
        const foundNotes = await Note.find({flag: 1}).exec(); 
        res.send(foundNotes);
        console.log("All notes fetched");           
    } catch(err) {
        console.log("Error while fetching notes:", err);
        res.status(500).send("An error occurred while fetching notes.");
    }
};


async function getDeletedNotes(req, res) {
    try {
        const foundDeletedNotes = await Note.find({flag: 0}).exec();
        res.send(foundDeletedNotes);
        console.log("Deleted notes fetched");
    } catch(err) {
        console.log("Error while fetching notes:", err);
        res.status(500).send("An error occurred while fetching notes.");
    }
}

async function getArchivedNotes(req, res) {
    try {
        const foundArchivedNotes = await Note.find({flag: 2}).exec();
        console.log("Archived notes fetched");
        res.send(foundArchivedNotes); 
    } catch(err) {
        console.log("Error while fetching archived notes:", err);
        res.status(500).send("An error occurred while fetching archived notes.");
    }
}

async function updateNote(req, res) {
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
        res.status(500).send("An error occurred while updating the note.");
    }    
}

async function safeDelete(req, res) {
    try {
        const id = req.query.id;
        await Note.findByIdAndUpdate({_id: id}, {"flag": 0}).exec();

        console.log("Note deleted");
        res.redirect('/');
    } catch (err) {
        console.log("Error while safe deleting note:", err);
        res.status(500).send("An error occurred while safe deleting the note.");
    }   
}

async function createNote(req, res) {
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
        res.status(500).send("An error occurred while creating the note.");
    }    
}

async function archiveNote (req, res) {
    try {
        const id = req.query.id;
        await Note.findByIdAndUpdate(id, {flag: 2}).exec();
        console.log("Note archived successfully.");
        res.redirect('/');
    } catch (err) {
        console.log("Error while archiving note:", err);
        res.status(500).send("An error occurred while archiving the note.");
    }    
}

async function unarchiveNote (req, res) {
    try {
        const id = req.query.id;
        await Note.findByIdAndUpdate(id, {flag: 1}).exec();
        console.log("Note unarchived successfully.");
        res.redirect('/');
    } catch(err) {
        console.log("Error while unarchiving note:", err);
        res.status(500).send("An error occurred while unarchiving the note.");
    }    
}

async function permanentDelete(req, res) {
    try {
        const id = req.query.id;
        await Note.findByIdAndDelete(id).exec();
        console.log("Note permanently deleted.");
        res.redirect('/');
    } catch (err) {
        console.log(err);
    }  
}

function invalidRoute (req, res) {
    res.status(404).json({ error: 'Invalid Page' });
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
}
