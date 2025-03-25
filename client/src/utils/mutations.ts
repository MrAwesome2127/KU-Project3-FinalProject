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

// export const ADD_TASK = gql`
//   mutation addTask($task: AddTaskArgs) {
//   addTask(task: $task) {
//     _id
//     username
//     email
//     savedTasks {
//       description
//       stressLevel
//       taskId
//       title
//     }
//   }
// }
// `
