import { gql } from "@apollo/client";
export const LIST_PROJECTS = gql`
  query ListProjects($search: String) {
    projects(search: $search) {
      id
      name
      description
      status
      dueDate
      taskCount
      completedTasks
    }
  }
`;
export const TASK_COMMENTS = gql`
  query TaskComments($taskId: ID!) {
    taskComments(taskId: $taskId) {
      id
      content
      authorEmail
      timestamp
    }
  }
`;
