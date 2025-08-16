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
export const ADD_TASK_COMMENT = gql`
  mutation AddTaskComment(
    $taskId: ID!
    $content: String!
    $authorEmail: String!
  ) {
    addTaskComment(
      taskId: $taskId
      content: $content
      authorEmail: $authorEmail
    ) {
      comment {
        id
        content
        authorEmail
        timestamp
      }
    }
  }
`;

export const UPDATE_PROJECT = gql`
  mutation UpdateProject(
    $id: ID!
    $name: String
    $description: String
    $status: String
    $dueDate: Date
  ) {
    updateProject(
      id: $id
      name: $name
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
