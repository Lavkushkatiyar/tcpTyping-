import { getTypingStats } from "./monkey-type.js";
import { getParagraph } from "./paragraph-api.js";
import {
  createUser,
  isUserExist,
  updateUserStats,
  validateUser,
} from "./api.js";

const decode = (data) => new TextDecoder().decode(data);
const encode = (data) => new TextEncoder().encode(data);

const sendTypingResult = async (conn, result) => {
  await conn.write(encode(result));
};

const startTypingSession = async ({ conn, userId }) => {
  const paragraph = await getParagraph();

  const buffer = new Uint8Array(paragraph.length);

  await conn.write(encode(paragraph + "\n\n"));
  await conn.write(encode("start typing : \n\n"));
  const startTime = Date.now();

  const readBytes = await conn.read(buffer);
  const userInput = decode(buffer.slice(0, readBytes)).trim();

  const typingMetrics = getTypingStats({
    paragraph: paragraph,
    userTypedWords: userInput.split(""),
    startTime,
  });

  updateUserStats(typingStats, userId, typingMetrics);

  await sendTypingResult(conn, typingMetrics);
};

const getUserCredentials = () => { // Ui Part
  const usersCredentials = {
    "userId": "username123",
    "userName": "username",
    "password": "12345",
  };

  // prompt user input
  // parse
  return usersCredentials;
};

const users = {}; // change to db later

const typingStats = {}; // change to db later

const apiHandler = (command, usersCredentials) => {
  switch (command) {
    case "CREATE_USER":
      return createUser(usersCredentials, users, typingStats);
    case "LOGIN_USER":
      return validateUser(usersCredentials, users);
  }
};

const userSignUp = (conn) => {
  const usersCredentials = getUserCredentials(conn);
  if (!isUserExist(usersCredentials, users)) {
    const response = apiHandler("CREATE_USER", usersCredentials);
    if (response.success) {
      return { conn, userId: response.body.userId };
    }
  }

  return { conn, error: "can't sign Up" };
};

const userLogin = (conn) => {
  const usersCredentials = getUserCredentials(conn);
  const response = apiHandler("LOGIN_USER", usersCredentials);

  if (response.success) {
    return { conn, userId: response.body.userId };
  }

  return { conn, error: "can't login " };
};

const userRequestHandler = async (request, userSession) => {
  switch (request) {
    case "start":
      return await startTypingSession(userSession);
  }
};

const signInOrLogin = async (conn) => {
  await conn.write(encode("login or signup: "));
  const buffer = new Uint8Array(1024);
  const readBytes = await conn.read(buffer);
  const command = decode(buffer.slice(0, readBytes)).trim();
  // const command = prompt();

  switch (command) {
    case "signUp":
      return userSignUp(conn);
    case "login":
      return userLogin(conn);
  }
};

export const handleConn = async (conn) => {
  const userSession = await signInOrLogin(conn);
  console.log(typingStats);
  console.log(users);

  await conn.write(encode("ENTER YOUR Command: ")); // sign up

  const buffer = new Uint8Array(1024);
  const readBytes = await conn.read(buffer);
  const request = decode(buffer.slice(0, readBytes)).trim();
  const response = await userRequestHandler(request, userSession);

  console.log(typingStats);
  conn.close();
};
