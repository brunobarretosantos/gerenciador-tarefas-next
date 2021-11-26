import mongoose, {Schema} from 'mongoose';

const UserSchema = new Schema({
    name: {type: String, require: true},
    email: {type: String, require: true},
    password: {type: String, require: true}
});

export const UserModel = (mongoose.models.users || mongoose.model('users', UserSchema))