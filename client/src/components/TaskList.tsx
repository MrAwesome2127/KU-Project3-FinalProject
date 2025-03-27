import React, { useState } from "react";
import { Droppable, Draggable } from "react-beautiful-dnd";
import Task from "./Task";
import "bootstrap/dist/css/bootstrap.min.css";
import { TaskDocument } from "../models/TaskDocument";
import dayjs from "dayjs";

interface TaskListProps {
  taskData: TaskDocument[];
  handleAddTask: (newTask: TaskDocument) => void;
  handleDeleteTask: (task: TaskDocument) => void;
  handleEditTask: (editedTask: TaskDocument, taskId: string) => void;
  role: string;
}

const TaskList: React.FC<TaskListProps> = ({
  taskData,
  handleAddTask,
  // Tim, uncomment with Joem
  //- Ryan

  handleDeleteTask,
  handleEditTask,
  role,
}) => {
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    stressLevel: "Low",
    dueDate: "",
  });

  const [editMode, setEditMode] = useState(false);

  const [taskId, setTaskId] = useState<string | null>(null);

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;

    console.log("value", value);
    setNewTask((prevTask) => ({ ...prevTask, [name]: value }));
  };

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = event.target;
    setNewTask((prevTask) => ({ ...prevTask, [name]: value }));
  };

  const handleAddTaskClick = () => {
    if (
      newTask.title &&
      newTask.description &&
      newTask.dueDate &&
      newTask.stressLevel
    ) {
      const task: TaskDocument = {
        title: newTask.title,
        description: newTask.description,
        stressLevel: newTask.stressLevel,
        // _id: Math.random().toString(36).substr(2, 9),
        dueDate: newTask.dueDate,
        statusTask: "new", // Set default status to 'new'
      };
      handleAddTask(task);
      setNewTask({
        title: "",
        description: "",
        stressLevel: "Low",
        dueDate: "",
      });
      closeModal();
    }
  };

  const handleEditTaskClick = (task: TaskDocument) => {
    const formattedDate = dayjs(parseInt(task?.dueDate || "0")).format(
      "YYYY-MM-DD"
    );

    setNewTask({
      title: task.title || "",
      description: task.description || "",
      stressLevel: task.stressLevel || "",
      dueDate: formattedDate,
    });

    setTaskId(task._id || null);

    setEditMode(true);
    showModal();
  };

  function showModal() {
    const targetModal = document.getElementById("addTaskModal");

    if (targetModal) {
      targetModal.style.display = "block";
      targetModal.style.backgroundColor = "rgba(0,0,0,0.7)";
    }
  }

  function closeModal() {
    const targetModal = document.getElementById("addTaskModal");

    if (targetModal) {
      targetModal.style.display = "none";
    }
  }

  const newTasks = taskData.filter((task) => task.statusTask === "new");
  const inProgressTasks = taskData.filter(
    (task) => task.statusTask === "inProgress"
  );
  const completedTasks = taskData.filter(
    (task) => task.statusTask === "completed"
  );

  return (
    <div>
      <div style={{ backgroundColor: "#F0FFF0", padding: "20px" }}>
        {role == "Wife" ? (
          <div className="text-center mb-5">
            <button
              onClick={() => {
                setEditMode(false);
                showModal();
              }}
              className="btn btn-primary"
              data-toggle="modal"
              data-target="#addTaskModal"
            >
              Add Task
            </button>
          </div>
        ) : null}
        <div
          className="modal"
          id="addTaskModal"
          tabIndex={-1}
          role="dialog"
          aria-labelledby="addTaskModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="addTaskModalLabel">
                  {editMode ? "Edit Task" : "Add New Task"}
                </h5>
              </div>
              <div className="modal-body">
                <form>
                  <div className="form-group">
                    <label>Title</label>
                    <input
                      type="text"
                      className="form-control"
                      name="title"
                      value={newTask.title}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      className="form-control"
                      name="description"
                      value={newTask.description}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Stress Level</label>
                    <select
                      className="form-control"
                      name="stressLevel"
                      value={newTask.stressLevel}
                      onChange={handleSelectChange}
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Due Date</label>
                    <input
                      type="date"
                      className="form-control"
                      name="dueDate"
                      value={newTask.dueDate}
                      onChange={handleInputChange}
                    />
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button
                  onClick={closeModal}
                  type="button"
                  className="btn btn-secondary"
                  data-dismiss="modal"
                >
                  Close
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={
                    editMode
                      ? () => {
                          console.log(taskId);

                          handleEditTask(newTask, taskId || "");
                        }
                      : handleAddTaskClick
                  }
                >
                  {editMode ? "Update Task" : "Add Task"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div style={{ backgroundColor: "white", padding: "20px" }}>
        <div className="row">
          <div className="col-4">
            <h2 className="text-center">New</h2>
            <div className="card">
              <div className="card-body">
                <Droppable droppableId="new">
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className="list-group"
                    >
                      {newTasks.map((task: any, index) => (
                        <Draggable
                          key={task._id}
                          draggableId={task._id}
                          index={index}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <Task
                                task={task}
                                handleDeleteTask={handleDeleteTask}
                                handleEditTask={handleEditTaskClick}
                                userId="wife"
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
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className="list-group"
                    >
                      {inProgressTasks.map((task, index) => (
                        <Draggable
                          key={task._id}
                          draggableId={task._id}
                          index={index}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <Task
                                task={task}
                                handleDeleteTask={handleDeleteTask}
                                handleEditTask={handleEditTask}
                                userId="wife"
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
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className="list-group"
                    >
                      {completedTasks.map((task, index) => (
                        <Draggable
                          key={task.id}
                          draggableId={task._id}
                          index={index}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <Task
                                task={task}
                                handleDeleteTask={handleDeleteTask}
                                handleEditTask={handleEditTask}
                                userId="wife"
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
      </div>
    </div>
  );
};

export default TaskList;
