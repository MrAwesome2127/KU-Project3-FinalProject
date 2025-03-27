import { useState, useEffect, } from'react';
import TaskList from '../components/TaskList';
import 'bootstrap/dist/css/bootstrap.min.css';
import { TaskDocument } from '../models/TaskDocument';
import { DragDropContext } from'react-beautiful-dnd';

import auth from '../utils/auth';
import { useMutation, useQuery } from '@apollo/client';
import { ADD_TASK, DELETE_TASK, UPDATE_TASK } from '../utils/mutations';
import { GET_ME } from '../utils/queries';

type Status = 'new' | 'inProgress' | 'completed';

function Dashboard() {

  if(!auth.loggedIn()) {
    return <h2>YOU MUST BE LOGGED IN TO ACCESS THIS PAGE</h2>
  }

  const [role, setRole] = useState("");
  // CAN only be Wife or Husband

  const [taskData, setTasks] = useState<TaskDocument[]>([]);


  const {loading, data} = useQuery(GET_ME)

  const [addTask, {error: addTaskError}] = useMutation(ADD_TASK);

  const [deleteTask, {error: deleteTaskError}] = useMutation(DELETE_TASK);

  const [updateTask, {error: updateTaskError}] = useMutation(UPDATE_TASK);

  if (addTaskError) {
    console.log('Error adding task:', addTaskError.message);
  }
  
  if (deleteTaskError) {
    console.log('Error deleting task:', deleteTaskError.message);
  }

  if (updateTaskError) {
    console.log('Error deleting task:', updateTaskError.message);
  }

  const tasks = data?.me?.savedTasks;

  useEffect(() => {
    const data: any = auth.getProfile();

    console.log(data)

    if(data?.wife == true) {
      setRole("Wife")
    } else {
      setRole("Husband")
    }

  }, [])

  const handleAddTask = async (newTask: TaskDocument) => {
    try { 

      await addTask({
        variables: { 
          task: newTask
        }
      });   
    } catch (err) {
      console.error(err);
    }
  }

  // Tim, uncomment with Joem
  //- Ryan

  // const handleDeleteTask = async (task: TaskDocument) => {
  //   try{
      
  //     await deleteTask({
  //       variables:{
  //         task: task
  //       }
  //     });
  //   }catch (err){
  //     console.log(err)
  //   }
  // };

  // const handleEditTask = async (editedTask: TaskDocument) => {
  //   try { 

  //     await updateTask({
  //       variables: { 
  //         task: editedTask
  //       }
  //     });   
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };

  const onDragEnd = (result: any) => {
    if (!result.destination) return;

    const sourceTask = tasks.find((task: any) => task._id === result.draggableId);
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
      const newTasks = prevTasks.map((task: any) => {
        if (task._id === updatedTask._id) {
          return updatedTask;
        }
        return task;
      });
      return newTasks;
    });
  };

  if(loading) {
    return (
      <>
        <h2>Still Loading, please wait!</h2>
      </>
    )
  }

  return (
    <>
        <h2>Welcome, user!</h2>

        <p>Role: {role}</p>
        

      <DragDropContext onDragEnd={onDragEnd}>
      <TaskList 
        taskData={taskData} 
        handleAddTask={handleAddTask} 

        // Tim, uncomment with Joem
        //- Ryan
        // handleDeleteTask={handleDeleteTask} 
        // handleEditTask={handleEditTask} 
        role={role} 
      />
      {(addTaskError || deleteTaskError || updateTaskError) && (
          <div className="col-12 my-3 bg-danger text-white p-3">
            Something went wrong...
          </div>
        )}
    </DragDropContext>
    <div/>
  
    
    </>
  );
}

export default Dashboard;