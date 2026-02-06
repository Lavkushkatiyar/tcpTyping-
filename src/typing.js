import { getTypingStats } from "./monkey-type.js";
import { getParagraph } from "./paragraph-api.js";

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
  console.log(userInput, para, typingMetrics);
};

const router = async (command, conn) => {
  switch (command) {
    case "start":
      return await startTypingSession(conn);
  }
};

export const handleConn = async (conn) => {
  await conn.write(encode("ENTER YOUR Command: "));
  const buf = new Uint8Array(1024);
  const readBytes = await conn.read(buf);
  const req = decode(buf.slice(0, readBytes)).trim();
  await router(req, conn);

  conn.close();
};
