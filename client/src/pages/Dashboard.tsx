// Dashboard.tsx
import React, { useState } from'react';
import { DragDropContext } from'react-beautiful-dnd';
import TaskList from '../components/TaskList';
import 'bootstrap/dist/css/bootstrap.min.css';

interface TaskDocument {
  id: string;
  taskId: string;
  title: string;
  description: string;
  stressLevel: string;
  dueDate: Date;
  column: string;
}

function Dashboard() {
  const [tasks, setTasks] = useState<TaskDocument[]>([
    { id: '1', taskId: '1', title: 'Task 1', description: 'This is task 1', stressLevel: 'Low', dueDate: new Date('2024-01-01'), column: 'new' },
    { id: '2', taskId: '2', title: 'Task 2', description: 'This is task 2', stressLevel: 'Medium', dueDate: new Date('2024-01-15'), column: 'inProgress' },
    { id: '3', taskId: '3', title: 'Task 3', description: 'This is task 3', stressLevel: 'High', dueDate: new Date('2024-02-01'), column: 'completed' },
  ]);

  const [userId, setUserId] = useState('wife');

  const handleMoveTask = (task: TaskDocument, toColumn: 'new' | 'inProgress' | 'completed') => {
    setTasks((prevTasks) => {
      const newTasks = [...prevTasks];
      const taskIndex = newTasks.findIndex((t) => t.id === task.id);
      if (taskIndex!== -1) {
        newTasks[taskIndex].column = toColumn;
      }
      return newTasks;
    });
  };

  const handleEditTask = (task: TaskDocument) => {
    // This function is handled in TaskList.tsx
  };

  const handleDeleteTask = (task: TaskDocument) => {
    // This function is handled in TaskList.tsx
  };

  const handleAddTask = (newTask: TaskDocument) => {
    setTasks((prevTasks) => {
      const newTasks = [...prevTasks];
      newTasks.push(newTask);
      return newTasks;
    });
  };

  const onDragEnd = (result: any) => {
    if (!result.destination) return;

    const { source, destination } = result;
    if (source.droppableId!== destination.droppableId) {
      const sourceColumn = tasks.filter((task) => task.column === source.droppableId);
      const destColumn = tasks.filter((task) => task.column === destination.droppableId);
      const sourceItems = sourceColumn;
      const destItems = destColumn;

      const [removed] = sourceItems.splice(source.index, 1);

      destItems.splice(destination.index, 0, removed);

      setTasks((prevTasks) => {
        const newTasks = [...prevTasks];
        const sourceIndex = newTasks.findIndex((t) => t.column === source.droppableId);
        const destIndex = newTasks.findIndex((t) => t.column === destination.droppableId);
        if (sourceIndex!== -1) {
          newTasks[sourceIndex].column = source.droppableId;
        }
        if (destIndex!== -1) {
          newTasks[destIndex].column = destination.droppableId;
        }
        return newTasks;
      });
    } else {
      const column = tasks.filter((task) => task.column === source.droppableId);
      const copiedItems = [...column];

      const [removed] = copiedItems.splice(source.index, 1);

      copiedItems.splice(destination.index, 0, removed);

      setTasks((prevTasks) => {
        const newTasks = [...prevTasks];
        const index = newTasks.findIndex((t) => t.column === source.droppableId);
        if (index!== -1) {
          newTasks[index].column = source.droppableId;
        }
        return newTasks;
      });
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <TaskList
        tasks={tasks}
        userId={userId}
        userRole="admin"
        handleMoveTask={handleMoveTask}
        handleEditTask={handleEditTask}
        handleDeleteTask={handleDeleteTask}
        handleAddTask={handleAddTask}
      />
    </DragDropContext>
  );
}

export default Dashboard;