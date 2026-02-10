import { getTypingStats } from "./typing_stats.js";
import { getParagraph } from "./paragraph_api.js";
import { updateUserStats } from "./user/user_services.js";
import { userLogin, userSignUp } from "./user/user_auth.js";
import { formatTypingStats } from "./typing_metrics.js";

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

  updateUserStats(typingStats, userId, typingMetrics);
  const userTypingReport = formatTypingStats(typingMetrics);
  await sendTypingResult(conn, userTypingReport);
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

  await conn.write(encode("login or signUp: "));

  const command = await readFromConnection(conn);

  if (authRouter[command]) {
    return authRouter[command](conn, users, typingStats);
  }
  return { success: false, error: "userExited" };
};

const readFromConnection = async (conn) => {
  const buffer = new Uint8Array(1024);
  const readBytes = await conn.read(buffer);
  return decode(buffer.slice(0, readBytes)).trim();
};

export const handleConn = async (conn, typingStats, users) => {
  const userSession = await establishUserSession(conn, users, typingStats);
  if (!userSession) {
    conn.close();
    return;
  }

  await runUserCommandLoop(conn, userSession, typingStats);
  conn.close();
};

async function establishUserSession(conn, users, typingStats) {
  while (true) {
    const session = await signInOrLogin(conn, users, typingStats);

    if (session.error) {
      await conn.write(encode(session.error));
      if (session.error === "userExited") {
        return null;
      }
      continue;
    }

    return session;
  }
}

async function runUserCommandLoop(conn, userSession, typingStats) {
  console.log(typingStats);

  while (true) {
    await conn.write(encode("Enter 'start' to start: "));
    const request = await readFromConnection(conn);

    if (request === "q") {
      return;
    }

    await userRequestHandler(request, userSession, typingStats);

    console.log(typingStats);
  }
}
