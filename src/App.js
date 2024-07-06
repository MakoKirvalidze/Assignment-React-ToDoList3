import React, { useState, useCallback, memo } from 'react';
import './App.css';

const TaskItem = memo(({ task, onAction, status }) => {
  console.log(`Rendering TaskItem: ${task}`);
  return (
    <li className="task-item">
      <span>{task}</span>
      <div className="button-group">
        {status === 'todo' && (
          <button onClick={() => onAction('moveToProgress')}>დაწყება</button>
        )}
        {status === 'inProgress' && (
          <>
            <button onClick={() => onAction('moveToCompleted')}>დასრულება</button>
            <button onClick={() => onAction('moveToTodo')}>უკან</button>
          </>
        )}
        {status === 'completed' && (
          <>
            <button onClick={() => onAction('delete')}>წაშლა</button>
            <button onClick={() => onAction('moveToProgress')}>დაბრუნება</button>
          </>
        )}
      </div>
    </li>
  );
});

const TaskList = memo(({ title, tasks, onTaskAction, status }) => {
  console.log(`Rendering TaskList: ${title}`);
  return (
    <div className="list">
      <h2>{title}</h2>
      <ul>
        {tasks.map((task, index) => (
          <TaskItem
            key={task}
            task={task}
            onAction={(action) => onTaskAction(index, action)}
            status={status}
          />
        ))}
      </ul>
    </div>
  );
});

function App() {
  const [todoTasks, setTodoTasks] = useState([]);
  const [inProgressTasks, setInProgressTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [newTask, setNewTask] = useState('');

  const addTask = useCallback(() => {
    if (newTask.trim() !== '') {
      setTodoTasks(prevTasks => [...prevTasks, newTask.trim()]);
      setNewTask('');
    }
  }, [newTask]);

  const handleTaskAction = useCallback((index, action, fromList) => {
    switch (action) {
      case 'moveToProgress':
        if (fromList === 'todo') {
          const movedTask = todoTasks[index];
          setTodoTasks(prevTasks => prevTasks.filter((_, i) => i !== index));
          setInProgressTasks(prevTasks => [...prevTasks, movedTask]);
        } else if (fromList === 'completed') {
          const movedTask = completedTasks[index];
          setCompletedTasks(prevTasks => prevTasks.filter((_, i) => i !== index));
          setInProgressTasks(prevTasks => [...prevTasks, movedTask]);
        }
        break;
      case 'moveToCompleted':
        const completedTask = inProgressTasks[index];
        setInProgressTasks(prevTasks => prevTasks.filter((_, i) => i !== index));
        setCompletedTasks(prevTasks => [...prevTasks, completedTask]);
        break;
      case 'moveToTodo':
        const todoTask = inProgressTasks[index];
        setInProgressTasks(prevTasks => prevTasks.filter((_, i) => i !== index));
        setTodoTasks(prevTasks => [...prevTasks, todoTask]);
        break;
      case 'delete':
        setCompletedTasks(prevTasks => prevTasks.filter((_, i) => i !== index));
        break;
    }
  }, [todoTasks, inProgressTasks, completedTasks]);

  console.log('Rendering App');

  return (
    <div className="App">
      <h1>To Do List</h1>
      <div className="input-container">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="შეიყვანეთ ახალი დავალება"
        />
        <button onClick={addTask}>დამატება</button>
      </div>
      <div className="lists-container">
        <TaskList
          title="შესასრულებელი"
          tasks={todoTasks}
          onTaskAction={(index, action) => handleTaskAction(index, action, 'todo')}
          status="todo"
        />
        <TaskList
          title="მიმდინარე"
          tasks={inProgressTasks}
          onTaskAction={(index, action) => handleTaskAction(index, action, 'inProgress')}
          status="inProgress"
        />
        <TaskList
          title="დასრულებული"
          tasks={completedTasks}
          onTaskAction={(index, action) => handleTaskAction(index, action, 'completed')}
          status="completed"
        />
      </div>
    </div>
  );
}

export default App;

