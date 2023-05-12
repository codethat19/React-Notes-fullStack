require('dotenv').config();
const express = require('express');
const cors = require('cors');
const controllers = require('./controllers/controllers.js');

const app = express();

app.use(cors());

const port = 4000;

app.use(express.urlencoded({
  extended: true
}));
app.use(express.json());


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
app.post('/permaDeleteNote', controllers.permanentNoteDeletion);

//Invalid Route
app.all('/*', controllers.invalidRoute);


//Server listen
app.listen(process.env.PORT || port, () => {
    console.log("Server running at port: " + port);
});