require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
const port = 4000;
app.use(express.urlencoded({
  extended: true
}));
app.use(express.json());
mongoose.set("strictQuery", false);
mongoose.connect("mongodb+srv://" + process.env.DB_USERNAME + ":" + process.env.DB_PASSWORD + "@cluster0.kxmtd.mongodb.net/" + process.env.DB_NAME + "?retryWrites=true&w=majority", {
  useNewUrlParser: true
});
mongoose.connection.on('connected', () => console.log('Connected'));

const noteSchema = new mongoose.Schema(
    {
        flag: {
            type: Number,
            default: 1,
            required: true
        },
        title: {
            type: String,
            default: "test_note_title",
            required: true
        },
        details: {
            type: String,
            default: "test_note_content",
            required: true
        },
    },
    {
        timestamps: {
          createdAt: true,
          updatedAt: true
        },
    }
);
const Note = mongoose.model("Note", noteSchema);

function CreateNote(newNote) {
    const { title, details } = newNote;
    const note = new Note ({
        title: title,
        details: details
    });
    const result = note.save();
    return;
}

// app.get('/', (req, res) => {
//     res.redirect('/view');
// })

app.route('/')
.get( (req, res) => {
    const notes  = Note.find({flag: 1}, (err, foundNotes) => {
        if (!err) {
            res.send(foundNotes);
        } else {
            console.log(err);
        }
    });
});

app.get('/deletedNotes', (req, res) => {
    console.log("Reached deletedNotes");
    const deletedNote  = Note.find({flag: 0}, (err, foundDeletedNotes) => {
        if (!err) {
            res.send(foundDeletedNotes);
        } else {
            console.log(err);
        }
    });
});

app.get('/archived', (req, res) => {
    console.log("Reached archivedNotes");
    const archivedNote  = Note.find({flag: 2}, (err, foundArchivedNotes) => {
        if (!err) {
            res.send(foundArchivedNotes);
        } else {
            console.log(err);
        }
    });
});

app.post('/create-note', (req, res) => {

    // const note = JSON.parse((Object.keys(req.body)));
    const note = req.body;
    // console.log(note);

    const noteTitle = note.title;
    const noteDetail = note.details;

    const addNewNote = new Note ({
        title: noteTitle,
        details: noteDetail
    });

    CreateNote(addNewNote);
    res.redirect('/');
});

app.post("/deleteNote", (req, res) => {
    // const note = JSON.parse((Object.keys(req.body)));
    // const id = note._id;
    const id = (Object.keys(req.body));
    //console.log(id);
    Note.findByIdAndUpdate(id, {flag: 0}, (err) => {
        if (err) {
            console.log(err);
        } else {
            // console.log("Successfully Deleted");
        }
    })
    // mongoose.connection.close();
    res.redirect('/view');
});

app.post("/archive", (req, res) => {
    // const note = JSON.parse((Object.keys(req.body)));
    // const id = note._id;
    const id = (Object.keys(req.body));
    //console.log(id);
    Note.findByIdAndUpdate(id, {flag: 2}, (err) => {
        if (err) {
            console.log(err);
        } else {
            // console.log("Successfully Deleted");
        }
    })
    // mongoose.connection.close();
    res.redirect('/view');
});

app.listen(process.env.PORT || port, () => {
    console.log("Server running at port: " + port);
});