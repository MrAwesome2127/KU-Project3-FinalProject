import TaskList from "../components/TaskList";
import auth from "../utils/auth";

// import { useQuery } from "@apollo/client";
// import { GET_ALL_TASKS } from "../utils/queries";

function Dashboard() {
//   const { loading, data } = useQuery(GET_ALL_TASKS);

//   const tasks = data.getAllTasks;

  //   if (!auth.loggedIn()) {
  //     return (
  //       <>
  //         <h1>You must be logged in first!</h1>
  //       </>
  //     );
  //   }

//   if (loading) {
//     return <h2>Data is still loading, please wait!</h2>;
//   }

  return (
    <>
      <h1>This is the dashboard page</h1>

      <TaskList
        // tasks={tasks}
        tasks={[
          {
            taskId: "assigned",
            title: "test 1",
            description: "this is a test",
            stressLevel: "high",
          },
          {
            taskId: "completed",
            title: "test 2",
            description: "this is a test 2",
            stressLevel: "medium",
          },
          {
            taskId: "inProgress",
            title: "test 3",
            description: "this is a test",
            stressLevel: "high",
          },
        ]}
      />
    </>
  );
}

export default Dashboard;
