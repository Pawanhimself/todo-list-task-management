const express = require('express');
const path = require('path');
const ejs = require('ejs');
const { v4: uuidv4 } = require('uuid');

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

const todoTasks = [];

// home page all tasks
app.get('/', (req, res) => {
    let queryParams = req.query;
    let priority = queryParams.priority ? queryParams.priority : "all";
    if( priority && priority != "all" ){
        const filteredTasks = todoTasks.filter((task) => {
            if( task.priority === priority ){
                return task;
            }
        });

        if(filteredTasks != []){
            return res.render('index', {tasks: filteredTasks, priority: priority });
        }
    }
console.log(todoTasks);
    return res.render('index', { tasks: todoTasks, priority: priority });
});

// add task form page
app.get('/add-task', (req, res) => {
    res.render('add-task');
});

// for adding a new task
app.post('/add-task', (req, res) => {
    const { task, priority } = req.body;
    const newTask = {
        id: uuidv4(),
        task,
        priority,
        isCompleted: false
    };  
    
    todoTasks.push(newTask); 
    console.log('New task added:', newTask);   
    res.redirect('/');
});

// edit task form page
app.get('/edit-task/:id', (req, res) => {
    const { id } = req.params;
    const task = todoTasks.find(t => t.id === id);
    
    if (!task) {
        console.log('Task not found for editing');
        return res.redirect('/');
    }
    
    res.render('edit-task', { task });
});

// update task
app.post('/edit-task/:id', (req, res) => {
    const { id } = req.params;
    const { task, priority } = req.body;
    
    const taskIndex = todoTasks.findIndex(t => t.id === id);    
    if (taskIndex !== -1) {
        todoTasks[taskIndex] = { id, task, priority };
        console.log('Task updated:', todoTasks[taskIndex]);
    } else {
        console.log('Task not found for update');
    }
    res.redirect('/');
});

app.post('/delete-task/:id', (req, res) => {
    const { id } = req.params;
    const taskIndex = todoTasks.findIndex(t => t.id === id);
    
    if (taskIndex !== -1) {
        todoTasks.splice(taskIndex, 1);
        console.log(`Task with id ${id} deleted`);
        res.redirect('/');
    }
});

app.post('/update-status/:id', (req, res) => {
    const { id } = req.params;
    const task = todoTasks.find(t => t.id === id );

    if(!task.isCompletd){
        task.isCompletd = true;
    }else{
        task.isCompletd = false;
    }

    return res.redirect('/');
});

app.listen(port,'0.0.0.0', () => {
    console.log(`Server is running at http://localhost:${port}`);
    console.log(`Press Ctrl+C to stop the server.`);
});