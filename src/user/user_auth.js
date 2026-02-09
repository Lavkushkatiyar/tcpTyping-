import { createUser, doesUserExist, validateUser } from "./user_services.js";

const handler = (command, usersCredentials, users, typingStats) => {
  switch (command) {
    case "CREATE_USER":
      return createUser(usersCredentials, users, typingStats);
    case "LOGIN_USER":
      return validateUser(usersCredentials, users);
  }
};

const getUserCredentials = (conn) => {
  const usersCredentials = {
    userId: "username123",
    userName: "username",
    password: "12345",
  };

  // prompt user input
  // parse
  return usersCredentials;
};

export const userSignUp = (conn, users, typingStats) => {
  const usersCredentials = getUserCredentials(conn);

  if (!doesUserExist(usersCredentials, users)) {
    const response = handler(
      "CREATE_USER",
      usersCredentials,
      users,
      typingStats,
    );
    if (response.success) {
      return { conn, userId: response.body.userId };
    }
  }

  return { conn, error: "can't sign Up" };
};

export const userLogin = (conn, users) => {
  const usersCredentials = getUserCredentials(conn);
  const response = handler("LOGIN_USER", usersCredentials, users);

  if (response.success) {
    return { conn, userId: response.body.userId };
  }

  return { conn, error: "can't login " };
};
