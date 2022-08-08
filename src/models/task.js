const mongoose = require('mongoose');
const validator = require('validator')


const taskSchema = new mongoose.Schema({
    description : {
        type : String,
        required : true,
        trim : true,
    },
    completed : {
        type : Boolean,
        default : false
    },
    owner: {
        type : mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'                   //provide reln between user and task. else we have to do manually. here mongoose will do for us
    }
}, {
    timestamps : true
})

const Task = mongoose.model('Task', taskSchema);

// const tsk = new Task({
//     description : 'Make a project',
// });

// tsk.save().then(()=>{
//     console.log(tsk)
// }).catch(error=>{
//     console.log(error)
// });

module.exports = Task


//we can take advantage of timestamps when we make our own schema