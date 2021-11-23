//Mongo Database using the Framework Mongoose
const mongoose = require('mongoose');

//You must set your MongoDB Url Dabase
mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true
}) 
    .then(db => {
        console.log(`DB is connected`)
    })
    .catch(err => console.error(err));