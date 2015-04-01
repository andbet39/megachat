

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Article Schema
 */
var MessageSchema = new Schema({
    msg: {
        type: String,
        default: '',
        required: 'Please fill Article name',
        trim: true
    },
    created: {
        type: Date,
        default: Date.now
    },
    user: {
        type: String,
        default: ''
    }
});

mongoose.model('Message', MessageSchema);
