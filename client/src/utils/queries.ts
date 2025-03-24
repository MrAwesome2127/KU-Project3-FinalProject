// QUERY FOR GETTING THE TASK FOR THE LOGGEDIN USER

// export default GET_ALL_TASKS

import { gql } from "@apollo/client";

export const QUERY_PROFILES = gql `
  query profiles{ 
    profile{
      _id
      username
      password
      passwordHusband
      passwordWife
    }
  }
`

export const QUERY_PROFILE = gql `
  query profile{   
    profile{
    _id
    username
    password
    passwordHusband
    passwordWife
    }
  }
`



export const GET_ME = gql`
query Me {
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