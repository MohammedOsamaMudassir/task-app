const express = require('express');
const router = new express.Router();
const Task = require('../models/task')
const auth = require('../middleware/auth')

router.post('/tasks', auth, async (req, res) => {
    //const task = new Task(req.body)//instead of body, we will make our own body

    const task = new Task({
        ...req.body,
        owner: req.user._id
    })

    try {
        await task.save()
        res.status(201).send(task)
    } catch (e) {
        res.status(400).send(e);
    }
})


// GET /tasks?completed=true
//GET /tasks?completed=true&sortBy=columnName_asc/desc
//Limit allows us to limit the number of results we get back for any given request. If that's what we wanted, we would set it equal to ten.
//Skip is also going to get set equal to a number, and this is what allows you to iterate over pages. So if I skip zero and get ten, I'm getting the first ten results. If I skip ten and then get ten, I'm getting the second set of ten.
//GET / tasks?limit=10&skip=20
//options property is used for sorting and pagination
//Now if limit isn't provided or it's not a number, it's going to be ignored by mongoose
//So now that we have timestamps enabled they could sort by when the task was last created or last updated or they could sort by the completed value putting the complete tasks first or putting the incomplete tasks first.

router.get('/tasks', auth, async (req, res) => {            //code to get tasks using mongoose
    const match = {};            //provide additional queries
    const sort = {}

    //console.log(req.user)
    if (req.query.completed) {
        match.completed = req.query.completed === 'true'
    }

    if(req.query.sortBy){
        const parts = req.query.sortBy.split(':');
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }

    // await req.user.populate('tasks').execPopulate()
    //  const tasks = await Task.find({owner: req.user._id});   

    try {
        await req.user.populate({
            path: 'tasks',
            match : match,
            options : {
                limit : parseInt(req.query.limit),
                skip : parseInt(req.query.skip),
                sort : sort
            }
        })
        
        res.send(req.user.tasks)
        
    } catch (e) {
        res.status(500).send()
    }
})

router.get('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id

    try {
        //const task = await Task.findById(_id);
        const task = await Task.findOne({ _id, owner: req.user._id })
        if (!task) return res.status(404).send()
        res.send(task);
    } catch (e) {
        res.status(500).send()
    }
})

router.patch('/tasks/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['description', 'completed']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid Updates' })
    }

    try {
        //modification for mongoose for using bcrypt
        //const task = await Task.findById(req.params.id);
        const task = await Task.findOne({ _id: req.params.id, owner: req.user._id })


        //const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
        if (!task)
            return res.status(404).send()

        updates.forEach((update) => task[update] = req.body[update])
        await task.save();

        res.send(task);

    } catch (e) {
        res.status(400).send(e);
    }
})

router.delete('/tasks/:id', auth, async (req, res) => {
    try {
        //const task = await Task.findByIdAndDelete(req.params.id)
        const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id })
        if (!task) return res.status(404).send()
        res.send(task);

    } catch (e) {
        res.status(500).send();
    }
})

module.exports = router;