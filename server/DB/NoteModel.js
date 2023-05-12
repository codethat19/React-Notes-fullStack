const mongoose = require('../DB/connection.js');

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
        colorId: {
            type: Number
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

module.exports = Note;