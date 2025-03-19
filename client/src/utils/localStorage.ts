export const getSavedTaskIds = () => {
  const savedTaskIds = localStorage.getItem('saved_tasks')
    ? JSON.parse(localStorage.getItem('saved_tasks')!)
    : [];

  return savedTaskIds;
};

export const saveTaskIds = (taskIdArr: string[]) => {
  if (taskIdArr.length) {
    localStorage.setItem('saved_tasks', JSON.stringify(taskIdArr));
  } else {
    localStorage.removeItem('saved_tasks');
  }
};

export const removetaskId = (taskId: string) => {
  const savedTaskIds = localStorage.getItem('saved_tasks')
    ? JSON.parse(localStorage.getItem('saved_tasks')!)
    : null;

  if (!savedTaskIds) {
    return false;
  }

  const updatedSavedTaskIds = savedTaskIds?.filter((savedTaskId: string) => savedTaskId !== taskId);
  localStorage.setItem('saved_tasks', JSON.stringify(updatedSavedTaskIds));

  return true;
};
