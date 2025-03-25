import { gql } from '@apollo/client';

export const ADD_PROFILE = gql`
  addProfile(input: $input) {
    token
    user {
      _id
      username
      email
      savedTasks {
        description
        stressLevel
        taskId
        title
      }
    }
  }
`;

export const LOGIN = gql`
  mutation login($email: String!, $password: String!) {
  login(email: $email, password: $password) {
    token
    user {
      _id
      email
      username
      savedTasks {
        description
        stressLevel
        taskId
        title
      }
    }
  }
}
`;

export const ADD_TASK = gql`
  mutation addTask($task: AddTaskArgs) {
  addTask(task: $task) {
    _id
    username
    email
    savedTasks {
      description
      stressLevel
      taskId
      title
    }
  }
}
`
