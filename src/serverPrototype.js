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
    await connection.read(buffer);
    console.log(decoder.decode(buffer));
  }
};
