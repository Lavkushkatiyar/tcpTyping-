import { getTypingStats } from "./monkey_type.js";
import { getParagraph } from "./paragraph_api.js";
import { updateUserStats } from "./handler.js";
import { userLogin, userSignUp } from "./user/user_service.js";

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

const typingStats = {}; // change to db later

const userRequestHandler = async (request, userSession) => {
  switch (request) {
    case "start":
      return await startTypingSession(userSession);
  }
};

const signInOrLogin = async (conn, typingStats) => {
  const authRouter = {
    "signUp": userSignUp,
    "login": userLogin,
  };

  await conn.write(encode("login or signup: "));

  const command = await readFromConnection(conn);
  return authRouter[command](conn, typingStats);
};

const readFromConnection = async (conn) => {
  const buffer = new Uint8Array(1024);
  console.log("i was there");

  const readBytes = await conn.read(buffer);
  return decode(buffer.slice(0, readBytes)).trim();
};

export const handleConn = async (conn) => {
  const userSession = await signInOrLogin(conn, typingStats);
  await conn.write(encode("ENTER YOUR Command: "));
  const request = await readFromConnection(conn);
  const response = await userRequestHandler(request, userSession);

  console.log(typingStats);
  conn.close();
};
