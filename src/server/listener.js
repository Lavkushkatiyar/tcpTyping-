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
      return createUser(users, args);

    case "FETCH_PARAGRAPH":
      return await fetchPara(paragraphs);

    case "CREATE_USER":
      return addUser(users, args);

    case "FETCH_USERS":
      return fetchUsers(users);
  }
};

const handler = async (users, paragraphs, conn) => {
  const buffer = new Uint8Array(1024);
  const request = await readFromConnection(conn, buffer);

  const response = await router(
    users,
    paragraphs,
    request.command,
    request.data,
  );
  await conn.write(encode(JSON.stringify(response)));
};

const startCentral = async () => {
  const listener = Deno.listen({ hostname: "127.0.0.1", port: 8000 });
  const users = {};
  const data = await getParagraph();

  const paragraphs = data;

  for await (const conn of listener) {
    console.log(`Connection established : `);

    await handler(users, {
      paragraphs,
      length: Object.keys(paragraphs).length,
    }, conn);
  }
};

startCentral();
