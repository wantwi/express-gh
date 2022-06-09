const mongoose = require('mongoose')

const connectDb = () => {
    mongoose.connect(process.env.NODE_EVN ==="production" ?  process.env.DB_PRODUCTION : process.env.DB_LOCAL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
 }).then(cons =>{
     console.log("connected to:" ,cons.connection.host);
 })
}

module.exports = connectDb