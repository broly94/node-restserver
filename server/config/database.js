const mongoose = require("mongoose");

const db = mongoose.connect(process.env.URLDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
})
if(db) {
    console.log("DB Conectada")
}
module.exports = db;