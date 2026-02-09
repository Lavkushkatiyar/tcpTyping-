import { getTypingStats } from "./monkey-type.js";
import { getParagraph } from "./paragraph-api.js";
import { addCredentials } from "./api.js";

const decode = (data) => new TextDecoder().decode(data);
const encode = (data) => new TextEncoder().encode(data);

const sendTypingResult = async (conn, result) => {
  await conn.write(encode(result));
};

const startTypingSession = async (conn) => {
  const buff = new Uint8Array(10024);

  const para = await getParagraph();

  await conn.write(encode(para + "\n\n"));
  await conn.write(encode("start typing : \n\n"));
  const startTime = Date.now();

  const readBytes = await conn.read(buff);
  const userInput = decode(buff.slice(0, readBytes)).trim();

  const typingMetrics = getTypingStats({
    paragraph: para,
    userTypedWords: userInput.split(""),
    startTime,
  });

  await sendTypingResult(conn, typingMetrics);
  // send to api
  console.log(userInput, para, typingMetrics);
};

const getUserCredentials = () => {
  const usersCredentials = {
    "userId": "username123",
    "userName": "username",
    "password": "12345",
  };

  // prompt user input
  // parse
  return usersCredentials;
};

const users = {};
const apiHandler = (command, usersCredentials) => {
  switch (command) {
    case "CREATE_USER":
      return addCredentials(usersCredentials, users);
  }
};

const signUp = (conn) => {
  const usersCredentials = getUserCredentials(conn);

  return apiHandler("CREATE_USER", usersCredentials);
};

const userRequestHandler = async (request, conn) => {
  const { command, data } = request;
  switch (request) {
    case "start":
      return await startTypingSession(conn);
    case "signUp":
      return await signUp(conn);
  }
};

export const handleConn = async (conn) => {
  await conn.write(encode("ENTER YOUR Command: ")); // sign up

  const buffer = new Uint8Array(1024);
  const readBytes = await conn.read(buffer);
  const request = decode(buffer.slice(0, readBytes)).trim();
  const response = await userRequestHandler(request, conn);
  console.log(response);

  conn.close();
};
