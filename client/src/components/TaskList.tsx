import React from'react';
// import { useQuery, gql } from '@apollo/client';
import { TaskDocument } from "../models/TaskDocument";

import Task from './Task'

interface TaskListProps {
  tasks: TaskDocument[];
}

const TaskList: React.FC<TaskListProps> = ({ tasks }) => {
  const [tasksToEdit, setTasksToEdit] = React.useState<TaskDocument[]>([]);

  const handleEditTask = (task: TaskDocument) => {
    const updatedTasks = [...tasksToEdit, task];
    setTasksToEdit(updatedTasks);
  };

  const handleDeleteTask = (task: TaskDocument) => {
    console.log(`Deleting task: ${task.title}`);
  };

  const handleMoveTask = (task: TaskDocument, toColumn: 'assigned' | 'inProgress' | 'completed') => {
    console.log(`Moving task: ${task.title} to column: ${toColumn}`);
  };

  const assignedTasks = tasks.filter((task) => task.taskId === 'assigned');
  const inProgressTasks = tasks.filter((task) => task.taskId === 'inProgress');
  const completedTasks = tasks.filter((task) => task.taskId === 'completed');

  return (
    <div>
      <section>
        <h2>Assigned Tasks</h2>
        <ul>
          {assignedTasks.map((task) => (
            <Task
              key={task.taskId}
              task={task}
              onEdit={() => handleEditTask(task)}
              onDelete={() => handleDeleteTask(task)}
              onMove={() => handleMoveTask(task, 'inProgress')}
            />
          ))}
        </ul>
      </section>

      <section>
        <h2>In Progress Tasks</h2>
        <ul>
          {inProgressTasks.map((task) => (
            <Task
              key={task.taskId}
              task={task}
              onEdit={() => handleEditTask(task)}
              onDelete={() => handleDeleteTask(task)}
              onMove={() => handleMoveTask(task, 'completed')}
            />
          ))}
        </ul>
      </section>

      <section>
        <h2>Completed Tasks</h2>
        <ul>
          {completedTasks.map((task) => (
            <Task
              key={task.taskId}
              task={task}
              onEdit={() => handleEditTask(task)}
              onDelete={() => handleDeleteTask(task)}
              onMove={() => handleMoveTask(task, 'completed')}
            />
          ))}
        </ul>
      </section>
    </div>
  );
};

export default TaskList;