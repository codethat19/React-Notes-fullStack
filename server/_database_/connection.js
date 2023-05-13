const mongoose = require('mongoose');

mongoose.set("strictQuery", false);

mongoose.connect("mongodb+srv://" + process.env.DB_USERNAME + ":" + process.env.DB_PASSWORD + "@cluster0.kxmtd.mongodb.net/" + process.env.DB_NAME + "?retryWrites=true&w=majority", {
  useNewUrlParser: true
});

mongoose.connection.on('connected', () => console.log('DB Connected'));

module.exports = mongoose;