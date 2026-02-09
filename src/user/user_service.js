import { createUser, isUserExist, validateUser } from "../handler.js";

const users = {}; // change to db later // needs to be in the main function and we will pass it from there only

const handler = (command, usersCredentials, typingStats) => {
  switch (command) {
    case "CREATE_USER":
      return createUser(usersCredentials, users, typingStats);
    case "LOGIN_USER":
      return validateUser(usersCredentials, users);
  }
};

const getUserCredentials = () => {
  const usersCredentials = {
    userId: "username123",
    userName: "username",
    password: "12345",
  };

  // prompt user input
  // parse
  return usersCredentials;
};

export const userSignUp = (conn, typingStats) => {
  const usersCredentials = getUserCredentials(conn);

  if (!isUserExist(usersCredentials, users)) {
    const response = handler("CREATE_USER", usersCredentials, typingStats);
    if (response.success) {
      return { conn, userId: response.body.userId };
    }
  }

  return { conn, error: "can't sign Up" };
};

export const userLogin = (conn) => {
  const usersCredentials = getUserCredentials(conn);
  const response = handler("LOGIN_USER", usersCredentials);

  if (response.success) {
    return { conn, userId: response.body.userId };
  }

  return { conn, error: "can't login " };
};
