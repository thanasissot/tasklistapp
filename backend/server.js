//server.js 

const express = require('express') 
const mongoose = require('mongoose') 
const cors = require('cors') 
const TodoModel = require("./models/todoList") 

var app = express(); 
app.use(cors()); 
app.use(express.json()); 

app.use((_req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', '*');
  
	next();
});


app.get('/', (req, res) => {
    res.send('Test API is connected!');
});

// Connect to your MongoDB database (replace with your database URL) 
(async () => {
  try {
    // Connect to the first MongoDB database
    await mongoose.connect("mongodb://root:root@mongo:27017/todo?authSource=admin", 
		{
			useNewUrlParser: true,
			useUnifiedTopology: true,
			serverSelectionTimeoutMS: 5000
		}
	);


    const db = mongoose.connection;
    await db.db.command({
		        createUser: "todos",
		        pwd: "todos",
		        roles: [
		            {"db":"todo", "role":"readWrite" }, 
		        ]
		    });

    // Disconnect from the first MongoDB database
    await mongoose.disconnect();
    console.log('Disconnected from first MongoDB database');

    await mongoose.connect("mongodb://todos:todos@mongo:27017/todo", 
		{
			useNewUrlParser: true,
			useUnifiedTopology: true,
			serverSelectionTimeoutMS: 5000
		});
  } catch (error) {
    console.error('Error connecting to or disconnecting from the first database:', error);
  }
})();


// Check for database connection errors 
mongoose.connection.on("error", (error) => { 
	console.error("MongoDB connection error:", error); 
}); 

// Get saved tasks from the database 
app.get("/api/getTodoList", (req, res) => { 
	TodoModel.find({}) 
		.then((todoList) => res.json(todoList)) 
		.catch((err) => res.json(err)) 
}); 

// Add new task to the database 

app.post("/api/addTodoList", (req, res) => { 
	TodoModel.create({ 
		task: req.body.task, 
		status: req.body.status, 
		deadline: req.body.deadline,
		description: req.body.description,
		category: req.body.category  
	}) 
		.then((todo) => res.json(todo)) 
		.catch((err) => res.json(err)); 
}); 

// Update task fields (including deadline) 
app.post("/api/updateTodoList/:id", (req, res) => { 
	const id = req.params.id; 
	const updateData = { 
		task: req.body.task, 
		status: req.body.status, 
		deadline: req.body.deadline,
		description: req.body.description,
		category: req.body.category
	}; 
	TodoModel.findByIdAndUpdate(id, updateData) 
		.then((todo) => res.json(todo)) 
		.catch((err) => res.json(err)); 
}); 

// Delete task from the database 
app.delete("/api/deleteTodoList/:id", (req, res) => { 
	const id = req.params.id; 
	TodoModel.findByIdAndDelete({ _id: id }) 
		.then((todo) => res.json(todo)) 
		.catch((err) => res.json(err)); 
}); 

app.listen(3001, () => { 
	console.log('Server running on 3001'); 
}); 
