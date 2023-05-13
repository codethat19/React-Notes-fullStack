function validateNoteInput(note, method) {
    const { title, details, colorId } = note;
  
    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      throw new Error('Invalid note title.');
    }
  
    if (!details || typeof details !== 'string' || details.trim().length === 0) {
      throw new Error('Invalid note details.');
    }
    
    if (method == "create") {
      if (!colorId || typeof colorId !== 'number' || colorId.length === 0) {
        throw new Error('Invalid note colorId.');
      }
    }
}

const sanitizeInput = (input) => {
  if (typeof input === 'string') {
    return input.trim();
  }
  return input;
};

module.exports = {
  validateNoteInput,
  sanitizeInput,

}
  