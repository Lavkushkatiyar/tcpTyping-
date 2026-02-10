import { createUser, doesUserExist, validateUser } from "./user_services.js";

const decode = (data) => new TextDecoder().decode(data);
const encode = (data) => new TextEncoder().encode(data);

const handler = (command, usersCredentials, users, typingStats) => {
  switch (command) {
    case "CREATE_USER":
      return createUser(usersCredentials, users, typingStats);
    case "LOGIN_USER":
      return validateUser(usersCredentials, users);
  }
};

const readFromConnection = async (conn) => {
  const buffer = new Uint8Array(1024);
  const readBytes = await conn.read(buffer);

  return decode(buffer.slice(0, readBytes)).trim();
};

const readLine = async (conn, prompt) => {
  conn.write(encode(prompt));
  return await readFromConnection(conn);
};

const getUserCredentials = async (conn) => {
  const usersCredentials = {
    userId: "",
    userName: "",
    password: "",
  };

  const fields = [
    { key: "userId", prompt: "\nEnter user ID: " },
    { key: "userName", prompt: "\nEnter username: " },
    { key: "password", prompt: "\nEnter password: " },
  ];

  for (const { key, prompt } of fields) {
    usersCredentials[key] = await readLine(conn, prompt);
  }

  return usersCredentials;
};

export const userSignUp = async (conn, users, typingStats) => {
  const usersCredentials = await getUserCredentials(conn);

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

  return { conn, error: "user already exist \n" };
};

export const userLogin = async (conn, users) => {
  const usersCredentials = await getUserCredentials(conn);
  const response = handler("LOGIN_USER", usersCredentials, users);

  if (response.success) {
    return { conn, userId: response.body.userId };
  }

  return { conn, error: "Password or userId is incorrect \n" };
};
