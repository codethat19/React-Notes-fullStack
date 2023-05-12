const Note = require('../DB/NoteModel');


// async function CreateNote(newNote) {
//     console.log("Create note called");
//     try {
//         const { title, details, colorId } = newNote;

//         const note = new Note ({
//             title: title,
//             details: details,
//             colorId: colorId
//         });

//         await note.save();
//     } catch {
//         console.log("Error while creating Note");
//     }
// }

async function getNotes(req, res) {
    console.log("getNotes called");
    try {
        const foundNotes = await Note.find({flag: 1}).exec(); 
        res.send(foundNotes);           
    } catch(err) {
            console.log(err);
    }
};


async function getDeletedNotes(req, res) {
    console.log("Reached deletedNotes");
    try {
        const foundDeletedNotes = await Note.find({flag: 0}).exec();
        res.send(foundDeletedNotes);
    } catch(err) {
        console.log(err);
    }
}

async function getArchivedNotes(req, res) {
    console.log("Reached archivedNotes");
    try {
        const foundArchivedNotes = await Note.find({flag: 2}).exec();
        res.send(foundArchivedNotes); 
    } catch(err) {
        console.log(err);
    }
}

async function updateNote(req, res) {
    try {
        await Note.findOneAndUpdate({_id: req.query.id}, 
            {"title": req.body.newNote.title, "details": req.body.newNote.details}, 
            function(err, updatedNote) {
            if (err) throw(err);
            console.log('Succesfully saved.');
        }
        )
    } catch(err) {
        console.log(err);
    }
    res.redirect('/');
}

async function safeDelete(req, res) {
    try {
        const id = req.query.id;
        console.log("deleteNote hit");

        await Note.findByIdAndUpdate({_id: id}, {"flag": 0}).exec();
    } catch (err) {
        console.log(err);
    }
    res.redirect('/');
}

async function createNote(req, res) {
    try {
        const { title: noteTitle, details: noteDetail, colorId: noteColorId } = req.body;

        const addNewNote = new Note ({
            title: noteTitle,
            details: noteDetail,
            colorId: noteColorId
        });

        await addNewNote.save();
    } catch(err) {
        console.log("error occured while creating note =>" + err);
    }

    res.redirect('/');
}

async function archiveNote (req, res) {
    try {
        const id = req.query.id;

        await Note.findByIdAndUpdate(id, {flag: 2}).exec();
    } catch (err) {
        console.log(err);
    }

    res.redirect('/');
}
async function unarchiveNote (req, res) {
    try {
        const id = req.query.id;

        await Note.findByIdAndUpdate(id, {flag: 1}).exec();
    } catch(err) {
        console.log(err);
    }

    res.redirect('/');
}
async function permanentNoteDeletion(req, res) {
    try {
        const id = req.query.id;

        await Note.findByIdAndDelete(id).exec();
    } catch (err) {
        console.log(err);
    }
    res.redirect('/');
}
function invalidRoute (req, res) {
    res.status(404).send({"error" : "Invalid Page"})
}

module.exports = {
    // CreateNote,
    getNotes,
    getDeletedNotes,
    getArchivedNotes,
    updateNote,
    safeDelete,
    createNote,
    archiveNote,
    unarchiveNote,
    permanentNoteDeletion,
    invalidRoute,
}
