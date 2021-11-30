import mongoose, {Schema} from 'mongoose';

const TaskSchema = new Schema({
    name: {type: String, require: true},
    userId: {type: String, required: true},
    previsionDate: {type: Date, require: true},
    finishDate: {type: Date, require: false}
});

export const TaskModel = (mongoose.models.task || mongoose.model('task', TaskSchema))