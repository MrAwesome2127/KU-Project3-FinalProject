import React, { useState, useEffect } from'react';
import TaskList from '../components/TaskList';
import 'bootstrap/dist/css/bootstrap.min.css';
import { TaskDocument } from '../models/TaskDocument';
import { DragDropContext } from'react-beautiful-dnd';

import auth from '../utils/auth';

type Status = 'new' | 'inProgress' | 'completed';

function Dashboard() {

  if(!auth.loggedIn()) {
    return <h2>YOU MUST BE LOGGED IN TO ACCESS THIS PAGE</h2>
  }



  const [role, setRole] = useState("");
  // CAN only be Wife or Husband

  const [tasks, setTasks] = useState<TaskDocument[]>([]);


  useEffect(() => {
    const data: any = auth.getProfile();

    console.log(data)

    if(data?.wife == true) {
      setRole("Wife")
    } else {
      setRole("Husband")
    }

  }, [])


  const handleAddTask = (newTask: TaskDocument) => {
    setTasks((prevTasks) => {
      const newTasks = [...prevTasks];
      newTasks.push(newTask);
      return newTasks;
    });
  };

  const handleDeleteTask = (task: TaskDocument) => {
    setTasks((prevTasks) => {
      const newTasks = prevTasks.filter((t) => t._id!== task._id);
      return newTasks;
    });
  };

  const handleEditTask = (editedTask: TaskDocument) => {
    setTasks((prevTasks) => {
      const newTasks = prevTasks.map((task) => {
        if (task._id === editedTask._id) {
          return editedTask;
        }
        return task;
      });
      return newTasks;
    });
  };

  const onDragEnd = (result: any) => {
    if (!result.destination) return;

    const sourceTask = tasks.find((task) => task._id === result.draggableId);
    if (!sourceTask) return;

    const statusMap: { [key: string]: Status } = {
      new: 'new',
      inProgress: 'inProgress',
      completed: 'completed',
    };

    const newStatus = statusMap[result.destination.droppableId as Status];

    if (sourceTask.status === newStatus) return;

    const updatedTask = {
     ...sourceTask,
      status: newStatus,
    };

    setTasks((prevTasks) => {
      const newTasks = prevTasks.map((task) => {
        if (task._id === updatedTask._id) {
          return updatedTask;
        }
        return task;
      });
      return newTasks;
    });
  };

  return (
    <>
        <h2>Welcome, user!</h2>

        <p>Role: {role}</p>


      <DragDropContext onDragEnd={onDragEnd}>
      <TaskList tasks={tasks} handleAddTask={handleAddTask} handleDeleteTask={handleDeleteTask} handleEditTask={handleEditTask} role={role} />
    </DragDropContext>
    
    
    
    </>
  );
}

export default Dashboard;