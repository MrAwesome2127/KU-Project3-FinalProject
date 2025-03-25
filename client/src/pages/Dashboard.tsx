import React, { useState } from'react';
import TaskList from '../components/TaskList';
import 'bootstrap/dist/css/bootstrap.min.css';
import { TaskDocument } from '../models/TaskDocument';
import { DragDropContext } from'react-beautiful-dnd';

type Status = 'new' | 'inProgress' | 'completed';

function Dashboard() {
  const [tasks, setTasks] = useState<TaskDocument[]>([]);

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
    <DragDropContext onDragEnd={onDragEnd}>
      <TaskList tasks={tasks} handleAddTask={handleAddTask} handleDeleteTask={handleDeleteTask} handleEditTask={handleEditTask} />
    </DragDropContext>
  );
}

export default Dashboard;