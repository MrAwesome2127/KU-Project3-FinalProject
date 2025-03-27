// QUERY FOR GETTING THE TASK FOR THE LOGGEDIN USER

// export default GET_ALL_TASKS

import { gql } from "@apollo/client";

export const GET_ME = gql`
query Me {
  me {
    _id
    email
    username
    savedTasks {
      _id
      title
      description
      stressLevel
      dueDate
      statusTask
    }
  }
}
`;
