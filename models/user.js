const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/testcaching').then(() => { console.log('connected to database') }).catch(err => {
    console.log
});


const userSchema = mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    }
})

const User = mongoose.model('User', userSchema);

module.exports = User;