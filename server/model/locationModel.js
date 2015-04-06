/**
 * Created by andreaterzani on 04/04/15.
 */


var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


var LocationSchema = new Schema({
    message: {
        type: String,
        default: '',
        trim: true
    },
    coordinates: {
        type: [Number]
    },
    created: {
        type: Date,
        default: Date.now
    },
});

mongoose.model('Location', LocationSchema);
