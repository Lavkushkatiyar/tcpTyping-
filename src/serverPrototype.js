import { fetchParagraph } from "./utils.js";

const decoder = new TextDecoder();
const createServer = (hostname, port) => {
  const server = Deno.listen({
    hostname,
    port,
    transport: "tcp",
  });
  return server;
};

export const startServer = async (hostname, port) => {
  console.log("server started");

  const server = createServer(hostname, port);

  for await (const connection of server) {
    console.log("connection established ");
    const buffer = new Uint8Array(1024);
    const readBytes = await connection.read(buffer);
    const command = decoder.decode(buffer.slice(0, readBytes));

    if (command == "fetchParagraph") {
      console.log({ command });

      const paragraph = fetchParagraph();
      console.log(paragraph);
    }
  }
};
