// Centralized, user-facing messages used across controllers
// Short, consistent, and grammatically-correct messages to return in API responses.
const MESSAGES = {
  // Authentication / Token
  TOKEN_NOT_FOUND: "Authentication token not found.",
  PLEASE_LOGIN: "Please log in.",

  // Generic / Server
  SERVER_ERROR: "Server error. Please try again later.",
  SOMETHING_WRONG: "Something went wrong. Please try again.",
  CANT_FETCH_DATA: "Unable to fetch data.",

  // Groups
  GROUP_CREATED: "Group created successfully.",
  GROUP_DELETED_AND_EXPENSE_DELETED:
    "Group and associated expenses deleted successfully.",
  GROUP_DELETED: "Group deleted successfully.",
  GROUP_NOT_EXIST: "Group does not exist.",

  // Expenses / Bills / Activities
  EXPENSE_CREATED: "Expense created successfully.",
  EXPENSE_DELETED: "Expense deleted successfully.",
  EXPENSE_NOT_EXIST: "Expense does not exist.",
  PAYMENT_SETTLED: "Payment settled successfully.",

  // Users
  USER_REGISTERED: "User registered successfully.",
  USER_LOGGED_IN: "User logged in successfully.",
  USER_LOGGED_OUT: "User logged out.",
  USER_NOT_EXIST: "User does not exist. Please register.",
  PASSWORD_MISMATCH: "Incorrect password.",

  // Template-like message (append the login method when used)
  USER_EXISTS_LOGIN_WITH: "User already exists. Please log in using",
};

export default MESSAGES;
