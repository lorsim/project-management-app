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

export const CREATE_TASK = gql`
  mutation CreateTask(
    $projectId: ID!
    $title: String!
    $description: String
    $assigneeEmail: String
    $status: String
    $dueDate: DateTime
  ) {
    createTask(
      projectId: $projectId
      title: $title
      description: $description
      assigneeEmail: $assigneeEmail
      status: $status
      dueDate: $dueDate
    ) {
      task {
        id
        title
        description
        status
        assigneeEmail
        dueDate
      }
    }
  }
`;

export const UPDATE_TASK_STATUS = gql`
  mutation UpdateTaskStatus($id: ID!, $status: String!) {
    updateTaskStatus(id: $id, status: $status) {
      task {
        id
        status
      }
    }
  }
`;
