import { getParagraph } from "../typingApp/paragraph-api.js";
import { createUser, fetchPara } from "./api.js";

const decode = (data) => new TextDecoder().decode(data);
const encode = (data) => new TextEncoder().encode(data);

const readFromConnection = async (conn, buffer) => {
  const bytes = await conn.read(buffer);

  return await JSON.parse(decode(buffer.slice(0, bytes)));
};

const router = async (users, paragraphs, command, args) => {
  switch (command) {
    case "CREATE":
      return createUser(users, args, userSession);

    case "FETCH_PARAGRAPH":
      return await fetchPara(paragraphs, userSession);

    case "CREATE_USER":
      return addUser(users, args, userSession);

    case "FETCH_USERS":
      return fetchUsers(users, userSession);
    case "START":
      return startUserInput(userSession);
  }
};

const handler = async (users, paragraphs, conn) => {
  while (true) {
    const buffer = new Uint8Array(1024);
    const request = await readFromConnection(conn, buffer);
    if (request.command === "EXIT") {
      conn.write(encode(JSON.stringify("Thank You")));
      conn.close();

      break;
    }
    const response = await router(
      users,
      paragraphs,
      request.command,
      request.data,
      userSession,
    );

    await conn.write(encode(JSON.stringify(response)));
  }
};

const startCentral = async () => {
  const listener = Deno.listen({ hostname: "127.0.0.1", port: 8000 });
  const users = {};
  const data = await getParagraph();

  const paragraphs = data;

  for await (const conn of listener) {
    const userSession = { paragraph: "", typedWord: "" };
    console.log(`Connection established : `);

    await handler(users, userSession, {
      paragraphs,
      length: Object.keys(paragraphs).length,
    }, conn);
  }
};

startCentral();
