import { getTypingStats } from "./typing.js";
import { getParagraph } from "./paragraph_api.js";
import { updateUserStats } from "./handler.js";
import { userLogin, userSignUp } from "./user/user_service.js";

const decode = (data) => new TextDecoder().decode(data);
const encode = (data) => new TextEncoder().encode(data);

const sendTypingResult = async (conn, result) => {
  await conn.write(encode(result));
};

const startTypingSession = async ({ conn, userId }, typingStats) => {
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
  console.log(typingMetrics);

  updateUserStats(typingStats, userId, typingMetrics);

  await sendTypingResult(conn, typingMetrics);
};

const userRequestHandler = async (request, userSession, typingStats) => {
  const userRequestMap = {
    "start": startTypingSession,
  };
  if (userRequestMap[request]) {
    return await userRequestMap[request](userSession, typingStats);
  }
};

const signInOrLogin = async (conn, users, typingStats) => {
  const authRouter = {
    "signUp": userSignUp,
    "login": userLogin,
  };

  await conn.write(encode("login or signup: "));

  const command = await readFromConnection(conn);
  if (authRouter[command]) {
    return authRouter[command](conn, users, typingStats);
  }
};

const readFromConnection = async (conn) => {
  const buffer = new Uint8Array(1024);
  const readBytes = await conn.read(buffer);
  return decode(buffer.slice(0, readBytes)).trim();
};

export const handleConn = async (conn, typingStats, users) => {
  const userSession = await signInOrLogin(conn, users, typingStats);
  console.log(typingStats);

  await conn.write(encode("ENTER YOUR Command: "));
  const request = await readFromConnection(conn);
  const response = await userRequestHandler(request, userSession, typingStats);

  console.log(typingStats);

  conn.close();
};
