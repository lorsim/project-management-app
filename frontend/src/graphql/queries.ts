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
