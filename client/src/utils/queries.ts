// QUERY FOR GETTING THE TASK FOR THE LOGGEDIN USER

// export default GET_ALL_TASKS

import { gql } from "@apollo/client";

export const GET_ME = gql`
query me {
  me {
    _id
    username
    email
    taskCount
    savedTasks {
      description
      taskId
      stressLevel
      title
    }
  }
}
`;
