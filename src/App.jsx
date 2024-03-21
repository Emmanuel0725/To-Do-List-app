import React, { useState, useEffect } from 'react';
import './App.css';
import 'typeface-dm-sans';
import 'typeface-roboto';
import "bootstrap/dist/css/bootstrap.min.css"; /* BOOTSTRAP 5 */
import TaskDetails from './TaskDetails';
import DeleteModal from './DeleteModal'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrashAlt, faEdit, faCheck } from '@fortawesome/free-solid-svg-icons';


function App() {
  const [showInput, setShowInput] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [tasks, setTasks] = useState(() => {
    const storedTasks = localStorage.getItem('tasks');
    return storedTasks ? JSON.parse(storedTasks) : [];
  });
  const [editIndex, setEditIndex] = useState(-1);
  const [selectedTaskId, setSelectedTaskId] = useState(null); 
  const [notes, setNotes] = useState('');
  const [currentMonth, setCurrentMonth] = useState('');
  const [currentDay, setCurrentDay] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false); 
  const [deleteIndex, setDeleteIndex] = useState(-1); 

  useEffect(() => {
    const date = new Date();
    const monthNames = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    const day = date.getDate();
    const month = date.getMonth();
    setCurrentMonth(monthNames[month]);
    setCurrentDay(day);
  }, []);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const handleInputChange = (e) => {
    setTaskTitle(e.target.value);
  };

  const handleAddTaskClick = () => {
    setShowInput(true);
  };

  const handleSaveTaskClick = () => {
    if (taskTitle.trim() !== '') {
      const newTask = {
        id: Date.now(), 
        title: taskTitle,
      };
      setTasks([...tasks, newTask]);
      setTaskTitle('');
      setShowInput(false);
    }
  };

  const handleDeleteTask = (taskId) => { 
    setDeleteIndex(taskId);
    setShowDeleteModal(true); 
  };

  const confirmDelete = () => {
    setTasks(tasks.filter(task => task.id !== deleteIndex));
    setShowDeleteModal(false); 
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
  };

  const handleEditClick = (taskId) => { 
    setEditIndex(taskId); 
    const task = tasks.find(task => task.id === taskId);
    setTaskTitle(task.title); 
  };

  const handleSaveEdit = () => {
    if (!taskTitle.trim()) {
      alert("Task title cannot be empty!");
      return; 
    }
  
    const updatedTasks = tasks.map(task => {
      if (task.id === editIndex) {
        return { ...task, title: taskTitle };
      }
      return task;
    });
    setTasks(updatedTasks);
    setEditIndex(-1);
    setTaskTitle('');
  };

  const handleTaskSelect = (taskId) => { 
    setSelectedTaskId(taskId);
  };

  const handleAddNotes = () => {
    const newNotes = prompt('Enter your notes:');
    setNotes(newNotes);
  };

  return (
    <>
      <div>
        <div className="container-fluid">
          <div className="row flex-nowrap">
            <div className="col-auto col-md-3 col-xl-2 px-sm-0 px-0 sidebar min-vh-100">
              <div className='d-flex justify-content-center mt-5'>
                
                <span className='fs-3 mt-2 custom-white custom-text'>LexDoTask<span className='fs-2 custom-light-orange'>!</span></span>
              </div>
              <div className='custom-border-colors mt-5 custom-dark-purple fw-normal fs-5 custom-bg-white mx-4 p-3 text-center rounded-3' style={{ width: '85%' }}>
                <a> My List </a>
              </div>
              <button
                className="border-0 fw-normal fs-6 custom-bg-purple mx-4 p-3 text-center rounded-3 custom-white mt-2 custom-hover "
                onClick={handleAddTaskClick}
                style={{ width: '85%' }} >
                <FontAwesomeIcon icon={faPlus} /> New Task
              </button>
              {showInput && (
                <div className="m-3 mx-4 position-relative">
                  <input
                    type="text"
                    className="form-control p-2"
                    placeholder="Enter task title"
                    value={taskTitle}
                    onChange={handleInputChange}
                  />
                  <button
                    className="border-0 btn position-absolute m-1 top-0 end-0"
                    style={{ background: '#9D71BC', color: '#F8FFFE' }}
                    onClick={handleSaveTaskClick}
                  >
                    <FontAwesomeIcon icon={faCheck} />
                  </button>
                </div>
              )}
              <div>
                <ul className="list-group mx-4 mt-5 position-relative">
                  {tasks.slice().reverse().map((task) => (
                    <li key={task.id} className="fs-6 list-group-item mt-2 fw-normal fs-5 p-3 text-center rounded-3 border-0" style={{ background: '#5E1B89', color: 'white' }} onClick={() => handleTaskSelect(task.id)}>
                    <div className="d-flex justify-content-between align-items-center">
                      {editIndex === task.id ? (
                        <input
                          type="text"
                          className="form-control p-2"
                          value={taskTitle}
                          onChange={(e) => setTaskTitle(e.target.value)}
                        />
                      ) : (
                        <span>{task.title}</span>
                      )}
                      <div>
                        {editIndex === task.id ? (
                          <button className="btn btn-warning border-0 mt-1" style={{ background: '#9D71BC', color: 'white' }} onClick={handleSaveEdit}><FontAwesomeIcon icon={faCheck} /></button>
                        ) : (
                          <button className="btn btn-warning border-0 mt-1" style={{ background: '#9D71BC', color: 'white' }} onClick={() => handleEditClick(task.id)}><FontAwesomeIcon icon={faEdit} /></button>
                        )}
                        <button className="btn btn-danger mx-1 mt-1" style={{ background: '#F4512C' }} onClick={() => handleDeleteTask(task.id)}><FontAwesomeIcon icon={faTrashAlt} /></button>
                      </div>
                    </div>
                  </li>
                  ))}
                </ul>
              </div>
              <div className="d-flex flex-column align-items-center align-items-sm-center px-0 pt-0">
                <span className='position-fixed bottom-0 m-3 custom-white'>© 2024 LexDoTask all right reserved</span>
              </div>
            </div>
            <div className="d-flex flex-column" style={{ width: '83.3%' }}>
            <div className="mt-5 d-flex justify-content-between custom-border-color">
              <div>
                <h1 className="fw-bolder custom-dark-purple custom-font-size">My Task: <span className='custom-light-orange'>{tasks.find(task => task.id === selectedTaskId)?.title}</span></h1>
              </div>
              <div className='fw-normal mb-2' style={{ marginRight: '30px' }}>
                <div className="month fs-1 custom-light-orange fw-bolder ">{currentMonth}</div>
                <div className="day fs-2 text-center mt-2 fw-bolder custom-dark-purple ">{currentDay}</div>
              </div>
            </div>
              {selectedTaskId && (
                <TaskDetails
                  selectedTask={selectedTaskId}
                  notes={notes}
                  handleAddNotes={handleAddNotes}
                />
              )}
              {!selectedTaskId && (
                <div className="d-flex flex-column justify-content-center align-items-center custom-margin-top">
                  <div className="loader"></div>
                  <h5 className='fs-6 custom-dark-purple mb-4' >(Select a task or add a new task)</h5>
                  <div>
                    <button
                      className="fs-6 custom-bg-purple p-3 border-0 text-center rounded-3 custom-white w-100"
                      onClick={handleAddTaskClick}
                      style={{ width: '85%' }} >
                      <FontAwesomeIcon icon={faPlus} /> New Task
                    </button>
                  </div>  
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <DeleteModal
        isOpen={showDeleteModal}
        onCancel={cancelDelete}
        onConfirm={confirmDelete} 
      />
    </>
  )
}

export default App;

