require('../src/db/mongoose')
const Task = require('../src/models/task')
const User = require('../src/models/user')

/*Task.findByIdAndDelete('62ebf9399cda09e09ae366c5').then((task) => {
    console.log(task)
    return Task.countDocuments({completed : false})
}).then((result) => {
    console.log(result);
}).catch(e => {
    console.log(e)
})

const updateAgeAndCount = async (id, age) => {
    const user = await User.findByIdAndUpdate(id, {age:age})
    const count = await User.countDocuments({age})
    return count
}

updateAgeAndCount('62eca33e6913145c80558abc', 24).then((count) =>{
    console.log(count)
}).catch(e => {
    console.log(e)
})*/

const deleteTaskAndCount = async (id) => {
    const task = await Task.findByIdAndDelete(id)
    const count = await Task.countDocuments({completed:false})
    return count
}

deleteTaskAndCount('62ec04ef24feb0903dc3ae2d').then((count) =>{
    console.log(count)
}).catch(e => {
    console.log(e)
})