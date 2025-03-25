// TaskList.tsx
import React from'react';
import { Draggable, Droppable } from'react-beautiful-dnd';
import Task from './Task';
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

interface TaskListProps {
  tasks: TaskDocument[];
  userId: string;
  userRole: string;
  handleMoveTask: (task: TaskDocument, toColumn: 'new' | 'inProgress' | 'completed') => void;
  handleEditTask: (task: TaskDocument) => void;
  handleDeleteTask: (task: TaskDocument) => void;
  handleAddTask: (newTask: TaskDocument) => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, userId, userRole, handleMoveTask, handleEditTask, handleDeleteTask }) => {
  const newTasks = tasks.filter((task) => task.column === 'new');
  const inProgressTasks = tasks.filter((task) => task.column === 'inProgress');
  const completedTasks = tasks.filter((task) => task.column === 'completed');

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-4">
          <h2 className="text-center">New</h2>
          <div className="card">
            <div className="card-body">
              <Droppable droppableId="new">
                {(provided) => (
                  <div ref={provided.innerRef} {...provided.droppableProps} className="list-group">
                    {newTasks.map((task, index) => (
                      <Draggable key={task.id} draggableId={task.id} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <Task
                              task={task}
                              handleMoveTask={handleMoveTask}
                              handleEditTask={handleEditTask}
                              handleDeleteTask={handleDeleteTask}
                              userId={userId}
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          </div>
        </div>
        <div className="col-4">
          <h2 className="text-center">In Progress</h2>
          <div className="card">
            <div className="card-body">
              <Droppable droppableId="inProgress">
                {(provided) => (
                  <div ref={provided.innerRef} {...provided.droppableProps} className="list-group">
                    {inProgressTasks.map((task, index) => (
                      <Draggable key={task.id} draggableId={task.id} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <Task
                              task={task}
                              handleMoveTask={handleMoveTask}
                              handleEditTask={handleEditTask}
                              handleDeleteTask={handleDeleteTask}
                              userId={userId}
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          </div>
        </div>
        <div className="col-4">
          <h2 className="text-center">Completed</h2>
          <div className="card">
            <div className="card-body">
              <Droppable droppableId="completed">
                {(provided) => (
                  <div ref={provided.innerRef} {...provided.droppableProps} className="list-group">
                    {completedTasks.map((task, index) => (
                      <Draggable key={task.id} draggableId={task.id} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <Task
                              task={task}
                              handleMoveTask={handleMoveTask}
                              handleEditTask={handleEditTask}
                              handleDeleteTask={handleDeleteTask}
                              userId={userId}
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          </div>
        </div>
      </div>
      {userId === 'wife' && (
        <div className="row mt-5">
          <div className="col-12">
            <button className="btn btn-primary" data-toggle="modal" data-target="#addTaskModal">Add Task</button>
          </div>
        </div>
      )}
      <div className="modal fade" id="addTaskModal" tabIndex={-1} role="dialog" aria-labelledby="addTaskModalLabel" aria-hidden="true">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="addTaskModalLabel">Add Task</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <form>
                <div className="form-group">
                  <label>Title</label>
                  <input type="text" className="form-control" id="title" />
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea className="form-control" id="description" />
                </div>
                <div className="form-group">
                  <label>Stress Level</label>
                  <select className="form-control" id="stressLevel">
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Due Date</label>
                  <input type="date" className="form-control" id="dueDate" />
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
              <button type="button" className="btn btn-primary" id="addTaskButton">Add Task</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskList;