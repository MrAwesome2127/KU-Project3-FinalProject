import { gql } from '@apollo/client';

export const ADD_PROFILE = gql`
  mutation AddProfile($input: AddUserArgs) {
    addProfile(input: $input) {
      token
    }
  }
`;

export const LOGIN = gql`
mutation Login($email: String!, $password: String!) {
  login(email: $email, password: $password) {
    token
  }
}
`;

export const ADD_TASK = gql`
  mutation AddTask($task: AddTaskArgs) {
    addTask(task: $task) {
      _id
      email
      username
      savedTasks {
        _id
        description
        dueDate
        statusTask
        stressLevel
        title
      }
    }
  }
`
export const DELETE_TASK = gql`
  mutation deleteTask($taskId: String!) {
    deleteTask(taskId: $taskId) {
      _id
      email
      savedTasks {
        _id
        description
        dueDate
        statusTask
        stressLevel
        title
      }
      username
    }
  }
`
export const UPDATE_TASK = gql`
  mutation Mutation($taskId: String!, $task: AddTaskArgs) {
    updateTask(taskId: $taskId, task: $task) {
      _id
      email
      savedTasks {
        title
        stressLevel
        statusTask
        dueDate
        description
        _id
      }
      username
    }
}
`