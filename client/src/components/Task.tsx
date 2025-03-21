import { TaskDocument } from "../models/TaskDocument";

interface TaskProps {
  task: TaskDocument;
  onEdit?(): void;
  onDelete?(): void;
  onMove?(task: TaskDocument, toColumn: 'wife' | 'husband'): void;
}

const Task: React.FC<TaskProps> = ({ task, onEdit, onDelete, onMove }) => {
  const handleEdit = () => {
    if (onEdit) {
      onEdit();
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete();
    }
  };

  const handleMove = () => {
    if (onMove) {
      onMove(task, task.taskId === 'husband'? 'husband' : 'wife');
    }
  };

  return (
    <li>
      <h2>{task.title}</h2>
      <p>{task.description}</p>
      <p>Stress Level: {task.stressLevel}</p>
      {task.taskId === 'husband' && (
        <div>
          <button onClick={handleEdit}>Edit</button>
          <button onClick={handleDelete}>Delete</button>
          <button onClick={handleMove}>Move</button>
        </div>
      )}
    </li>
  );
};

export default Task;