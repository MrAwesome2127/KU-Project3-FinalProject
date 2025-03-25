import React from 'react';
import { TaskDocument } from '../models/TaskDocument';

interface TaskProps {
  task: TaskDocument;
  handleEditTask: (task: TaskDocument) => void;
  handleDeleteTask: (task: TaskDocument) => void;
  userId: string;
}

const Task: React.FC<TaskProps> = ({ task, handleEditTask, handleDeleteTask, userId }) => {
  const dueDateColor = () => {
    const today = new Date();
    const dueDate = task.dueDate;

    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays > 1) {
      return 'bg-success'; // Green
    } else if (diffDays >= 0) {
      return 'bg-warning'; // Yellow
    } else {
      return 'bg-danger'; // Red
    }
  };

  return (
    <div className={`list-group-item ${dueDateColor()}`}>
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">{task.title}</h5>
          <p className="card-text">{task.description}</p>
          <p className="card-text">Stress Level: {task.stressLevel}</p>
          <p className="card-text">Due Date: {task.dueDate.toDateString()}</p>
          <p className="card-text">Status: {task.status}</p> {/* Add this line */}
          {userId === 'wife' && (
            <div>
              <button className="btn btn-primary" data-toggle="modal" data-target="#editTaskModal" onClick={() => handleEditTask(task)}>Edit</button>
              <button className="btn btn-danger" onClick={() => handleDeleteTask(task)}>Delete</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Task;