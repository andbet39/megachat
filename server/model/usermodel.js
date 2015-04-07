/**
 * Created by andreaterzani on 04/04/15.
 */


var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


var UserSchema = new Schema({
    username: {
        type: String,
        trim: true
    },
    password: {
        type: String,
        trim: true
    }

});





mongoose.model('User', UserSchema);

