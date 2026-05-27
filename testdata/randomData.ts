import { randomStringGen } from "../utils/randomUtils";

const randomString = randomStringGen(4);

export const adminPageData = {
  adminPageHeader: "Admin",
  adminPageSubHeader: "Configuration",
  projectName: "Project_Auto_" + randomString,
  projectName1: "Project_Auto_" + randomString,
  projectDescription: "Project_Description",
  solutionQueueName: "Solution_Queue_Auto_" + randomString,
  solutionQueueDescription: "Solution_Queue_description",
  deleteFailedSolutionDays: "4 Days",
  notificationWarningFailedSolutionDays: "4 Days",
  deleteSuccessSolutionDays: "2 Days",
  notificationWarningSuccessSolutionDays: "2 Days",
  mainPage: {
    tabs: ["Configuration", "Groups", "Users", "Queues", "Projects"],
  },
  configurationTab: {
    options: ["Server", "Logs", "Licenses"],
    serverDetailsLabels: [
      "Server Name",
      "Server URL",
      "Host Name",
      "Physical CPU Count",
      "Logical CPU Count",
      "Total RAM",
      "Available RAM",
      "Queue Count",
      "Connected Workers",
      "Start Time",
      "Shutdown Pending",
      "API Revision",
      "API Branch",
      "UI Revision",
      "UI Branch",
      "Current user PlanOS name",
      "Current user IAM ID",
      "Current user Email",
    ],
    paginationButtons: ["1", "2"],
    licensesTableHeaders: ["Module", "Active", "Exp Date"],
  },
  groupsTab: {
    newGroup: {
      inputFieldLabels: [
        "Identity Access Group",
        "PlanOS Group Name",
        "Description",
      ],
      groupIAMSearchText: "group",
      groupIAM: "group_all",
      groupName: "Group All",
      groupDescription: "Group with users: ['A', 'L', 'L']",
    },
  },
  queuesTab: {
    queueTypes: ["Jobs", "Solutions"],
  },
  projectTab: {
    subtabs: ["Properties", "Groups", "Users", "Queues"],
  },
};
