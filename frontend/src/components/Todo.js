import axios from "axios"; 
import React from "react"; 
import { useEffect, useState } from "react"; 

axios.defaults.baseURL="http://localhost:3001"

function Todo() { 
	const [todoList, setTodoList] = useState([]); 
	const [editableId, setEditableId] = useState(null); 
	const [editedTask, setEditedTask] = useState(""); 
	const [editedStatus, setEditedStatus] = useState("");
	const [editedDeadline, setEditedDeadline] = useState(""); 
	const [editedDescription, setEditedDescription] = useState("");
	const [editedCategory, setEditedCategory] = useState("");
	const [newTask, setNewTask] = useState(""); 
	const [newStatus, setNewStatus] = useState(""); 
	const [newDeadline, setNewDeadline] = useState(""); 
	const [newDescription, setNewDescription] = useState(""); 
	const [newCategory, setNewCategory] = useState("");

	// Fetch tasks from database 
	useEffect(() => { 
		axios.get('/api/getTodoList') 
			.then(result => { 
				setTodoList(result.data) 
			}) 
			.catch(err => console.log(err)) 
	}, []) 

	// Function to toggle the editable state for a specific row 
	const toggleEditable = (id) => { 
		const rowData = todoList.find((data) => data._id === id); 
		if (rowData) { 
			setEditableId(id); 
			setEditedTask(rowData.task); 
			setEditedStatus(rowData.status); 
			setEditedDeadline(rowData.deadline || "");
			setEditedDescription(rowData.description); 
			setEditedCategory(rowData.category);
		} else { 
			setEditableId(null); 
			setEditedTask(""); 
			setEditedStatus(""); 
			setEditedDeadline("");
			setEditedDescription(""); 
			setEditedCategory(rowData.category);
		} 
	}; 


	// Function to add task to the database 
	const addTask = (e) => { 
		e.preventDefault(); 
		if (!newTask || !newStatus || !newDeadline || !newDescription || !newCategory) { 
			alert("All fields must be filled out."); 
			return; 
		} 

		axios.post('/api/addTodoList', { task: newTask, status: newStatus, deadline: newDeadline, description: newDescription, category: newCategory }) 
			.then(res => { 
				console.log(res); 
				window.location.reload(); 
			}) 
			.catch(err => console.log(err)); 
	} 

	// Function to save edited data to the database 
	const saveEditedTask = (id) => { 
		const editedData = { 
			task: editedTask, 
			status: editedStatus, 
			deadline: editedDeadline,
			description: editedDescription, 
			category: editedCategory
		}; 

		// If the fields are empty 
		if (!editedTask || !editedStatus || !editedDeadline || !editedDescription || !editedCategory) { 
			alert("All fields must be filled out."); 
			return; 
		} 

		// Updating edited data to the database through updateById API 
		axios.post('/api/updateTodoList/' + id, editedData) 
			.then(result => { 
				console.log(result); 
				setEditableId(null); 
				setEditedTask(""); 
				setEditedStatus(""); 
				setEditedDeadline(""); // Clear the edited deadline
				setEditedDescription(""); // Clear the edited description
				setEditedCategory(""); // Clear the edited category
				window.location.reload(); 
			}) 
			.catch(err => console.log(err)); 
	} 


	// Delete task from database 
	const deleteTask = (id) => { 
		axios.delete('/api/deleteTodoList/' + id) 
			.then(result => { 
				console.log(result); 
				window.location.reload(); 
			}) 
			.catch(err => 
				console.log(err) 
			) 
	} 

	return ( 
		<div className="container mt-5"> 
			<div className="row"> 
				<div className="col-md-7"> 
					<h2 className="text-center">Task List</h2> 
					<div className="table-responsive"> 
						<table className="table table-bordered"> 
							<thead className="table-primary"> 
								<tr> 
									<th>Task</th> 
									<th>Status</th> 
									<th>Deadline</th>
									<th>Description</th>
									<th>Category</th>   
									<th>Actions</th> 
								</tr> 
							</thead> 
							{Array.isArray(todoList) ? ( 
								<tbody> 
									{todoList.map((data) => ( 
										<tr key={data._id}> 
											<td> 
												{editableId === data._id ? ( 
													<input 
														type="text"
														className="form-control"
														value={editedTask} 
														onChange={(e) => setEditedTask(e.target.value)} 
													/> 
												) : ( 
													data.task 
												)} 
											</td> 
											<td> 
												{editableId === data._id ? ( 
													<input 
														type="text"
														className="form-control"
														value={editedStatus} 
														onChange={(e) => setEditedStatus(e.target.value)} 
													/> 
												) : ( 
													data.status 
												)} 
											</td> 
											<td> 
												{editableId === data._id ? ( 
													<input 
														type="date"
														className="form-control"
														value={editedDeadline} 
														onChange={(e) => setEditedDeadline(e.target.value)} 
													/> 
												) : ( 
													data.deadline ? new Date(data.deadline).toDateString() : ''
												)} 
											</td>
											<td> 
												{editableId === data._id ? ( 
													<input 
														type="text"
														className="form-control"
														value={editedDescription} 
														onChange={(e) => setEditedDescription(e.target.value)} 
													/> 
												) : ( 
													data.description 
												)} 
											</td>
											<td> 
												{editableId === data._id ? ( 
													<input 
														type="text"
														className="form-control"
														value={editedCategory} 
														onChange={(e) => setEditedCategory(e.target.value)} 
													/> 
												) : ( 
													data.category 
												)} 
											</td>  

											<td> 
												{editableId === data._id ? ( 
													<button className="btn btn-success btn-sm" onClick={() => saveEditedTask(data._id)}> 
														Save 
													</button> 
												) : ( 
													<button className="btn btn-primary btn-sm" onClick={() => toggleEditable(data._id)}> 
														Edit 
													</button> 
												)} 
												<button className="btn btn-danger btn-sm ml-1" onClick={() => deleteTask(data._id)}> 
													Delete 
												</button> 
											</td> 
										</tr> 
									))} 
								</tbody> 
							) : ( 
								<tbody> 
									<tr> 
										<td colSpan="4">Loading products...</td> 
									</tr> 
								</tbody> 
							)} 


						</table> 
					</div> 
				</div> 
				<div className="col-md-5"> 
					<h2 className="text-center">Add Task</h2> 
					<form className="bg-light p-4"> 
						<div className="mb-3"> 
							<label>Task</label> 
							<input 
								className="form-control"
								type="text"
								placeholder="Enter Task"
								onChange={(e) => setNewTask(e.target.value)} 
							/> 
						</div> 
						<div className="mb-3"> 
							<label>Status</label> 
							<input 
								className="form-control"
								type="text"
								placeholder="Enter Status"
								onChange={(e) => setNewStatus(e.target.value)} 
							/> 
						</div> 
						<div className="mb-3"> 
							<label>Deadline</label> 
							<input 
								className="form-control"
								type="date"
								onChange={(e) => setNewDeadline(e.target.value)} 
							/> 
						</div>
						<div className="mb-3"> 
							<label>Description</label> 
							<input 
								className="form-control"
								type="text"
								onChange={(e) => setNewDescription(e.target.value)} 
							/> 
						</div>
						<div className="mb-3"> 
							<label>Category</label> 
							<input 
								className="form-control"
								type="text"
								onChange={(e) => setNewCategory(e.target.value)} 
							/> 
						</div>  
						<button onClick={addTask} className="btn btn-success btn-sm"> 
							Add Task 
						</button> 
					</form> 
				</div> 

			</div> 
		</div> 
	)
} 
export default Todo;
