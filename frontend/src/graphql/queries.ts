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

export const PROJECT_TASKS = gql`
  query ProjectTasks(
    $projectId: ID!
    $status: String
    $assigneeEmail: String
    $first: Int
    $offset: Int
  ) {
    projectTasks(
      projectId: $projectId
      status: $status
      assigneeEmail: $assigneeEmail
      first: $first
      offset: $offset
    ) {
      id
      title
      description
      status
      assigneeEmail
      dueDate
    }
  }
`;

export const PROJECT_STATS = gql`
  query ProjectStats($projectId: ID!) {
    projectStats(projectId: $projectId)
  }
`;
