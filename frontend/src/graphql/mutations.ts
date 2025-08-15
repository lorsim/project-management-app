import { gql } from "@apollo/client";
export const CREATE_PROJECT = gql`
  mutation CreateProject(
    $inputName: String!
    $description: String
    $status: String
    $dueDate: Date
  ) {
    createProject(
      name: $inputName
      description: $description
      status: $status
      dueDate: $dueDate
    ) {
      project {
        id
        name
        description
        status
        dueDate
        taskCount
        completedTasks
      }
    }
  }
`;
