const mongoose = require('mongoose')



const connectDb = () => {
    mongoose.connect(process.env.DB_PRODUCTION, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(cons => {
        console.log("connected to:", cons.connection.host);
    }).catch(err => {
        console.log({ err });
    })
}

module.exports = connectDb

//mongoose.connect(process.env.NODE_EVN ==="production" ?  process.env.DB_PRODUCTION : process.env.DB_LOCAL, {
    // mongoose.connect(process.env.DB_PRODUCTION, {