import React, { useState, useEffect, useRef } from 'react';
import styles from './TodoList.module.css'; // Import CSS module styles
import DeleteIcon from '@mui/icons-material/Delete'; // Import DeleteIcon from Material-UI
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'; // Import DeleteForeverIcon from Material-UI
import BeenhereIcon from '@mui/icons-material/Beenhere'; // Import BeenhereIcon from Material-UI
import TaskAltIcon from '@mui/icons-material/TaskAlt'; // Import TaskAltIcon from Material-UI

const TodoList = () => {
  // State for tasks
  const [tasks, setTasks] = useState([]);
  // State for filtered tasks
  const [filteredTasks, setFilteredTasks] = useState([]);
  // State for completed tasks
  const [completedTasks, setCompletedTasks] = useState([]);
  // State for task text input
  const [taskText, setTaskText] = useState('');
  // State for search text input
  const [searchText, setSearchText] = useState('');
  // Reference for task item
  const taskItemRef = useRef(null);
  // State for hovered task id
  const [hoveredTaskId, setHoveredTaskId] = useState(null);

  // Effect to load tasks from local storage on component mount
  useEffect(() => {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks));
    }
  }, []);

  // Effect to filter tasks based on search text and update filtered tasks
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    setFilteredTasks(tasks.filter(task => !task.completed && task.text.toLowerCase().includes(searchText.toLowerCase())));
    setCompletedTasks(tasks.filter(task => task.completed && task.text.toLowerCase().includes(searchText.toLowerCase())));
  }, [tasks, searchText]);

  // Function to add task
  const addTask = () => {
    if (taskText.trim() !== '') {
      setTasks([...tasks, { id: Date.now(), text: taskText, completed: false }]);
      setTaskText('');
    }
  };

  // Function to remove task
  const removeTask = id => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  // Function to toggle task completion
  const toggleTask = id => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  // Effect to adjust task item width based on content width
  useEffect(() => {
    if (taskItemRef.current) {
      const containerWidth = taskItemRef.current.offsetWidth;
      const spanWidth = taskItemRef.current.querySelector('span').offsetWidth;
      if (spanWidth > containerWidth) {
        taskItemRef.current.style.width = `${spanWidth + 20}px`; // Adjust width as needed
      }
    }
  }, [tasks]);

  return (
    <div className={styles.container} style={{backgroundColor: '#FDFCFA'}}>
      {/* Header */}
      <header className={styles.header}>
        {/* Title with icon */}
        <h1>
          <BeenhereIcon style={{ marginRight: '10px', fontSize: '32px', color: '#007bff', verticalAlign: 'middle' }} />
          To-Do List
        </h1>
        {/* Search bar */}
        <div className={styles.searchBar} style={{justifyContent: 'center'}}>
          <input
            type="text"
            placeholder="Search tasks"
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
          />
        </div>
        {/* Task input */}
        <div className={styles.taskInput}>
          <input
            type="text"
            placeholder="Add a task"
            value={taskText}
            onChange={e => setTaskText(e.target.value)}
            onKeyPress={e => {
              if (e.key === 'Enter') addTask();
            }}
          />
          <button onClick={addTask} style={{backgroundColor: '#007bff'}}>Add</button>
        </div>
      </header>
      {/* Task list */}
      <ul className={styles.taskList}>
        {filteredTasks.map(task => (
          <li key={task.id} className={styles.taskItem} ref={taskItemRef}>
            {/* Checkbox */}
            <label className={styles.checkboxContainer}>
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleTask(task.id)}
              />
              <span className={styles.checkmark}></span>
            </label>
            {/* Task text */}
            <span className={task.completed ? styles.completed : ''}>{task.text}</span>
            {/* Delete button */}
            <button
              style={{backgroundColor: 'transparent'}}
              onMouseEnter={() => setHoveredTaskId(task.id)}
              onMouseLeave={() => setHoveredTaskId(null)}
              onClick={() => removeTask(task.id)}
            >
              {/* Conditional rendering of delete icon */}
              {hoveredTaskId === task.id ? <DeleteForeverIcon style={{color: 'black', fontSize: '24px', verticalAlign: 'middle' }} /> : <DeleteIcon style={{color: 'red', fontSize: '24px', verticalAlign: 'middle' }} />}
            </button>
          </li>
        ))}
      </ul>
      {/* Completed tasks section */}
      {completedTasks.length > 0 && (
        <div className={styles.completedTasksContainer}>
          {/* Completed tasks header */}
          <div className={styles.completedHeader} style={{padding: '2px', borderRadius: '4px'}}>
            {/* Icon and text */}
            <TaskAltIcon style={{ color: '#007bff', marginRight: '10px', fontSize: '28px', verticalAlign: 'middle' }} />
            <h2 style={{ color: 'black', display: 'inline-block', verticalAlign: 'middle' }}>Completed</h2>
          </div>
          {/* Completed tasks list */}
          <ul className={styles.taskList}>
            {completedTasks.map(task => (
              <li key={task.id} className={styles.taskItem} ref={taskItemRef}>
                {/* Checkbox */}
                <label className={styles.checkboxContainer}>
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleTask(task.id)}
                  />
                  <span className={styles.checkmark}></span>
                </label>
                {/* Task text */}
                <span className={task.completed ? styles.completed : ''}>{task.text}</span>
                {/* Delete button */}
                <button
                  style={{backgroundColor: 'transparent'}}
                  onMouseEnter={() => setHoveredTaskId(task.id)}
                  onMouseLeave={() => setHoveredTaskId(null)}
                  onClick={() => removeTask(task.id)}
                >
                  {/* Conditional rendering of delete icon */}
                  {hoveredTaskId === task.id ? <DeleteForeverIcon style={{color: 'black', fontSize: '24px', verticalAlign: 'middle' }} /> : <DeleteIcon style={{color: 'red', fontSize: '24px', verticalAlign: 'middle' }} />}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default TodoList;
