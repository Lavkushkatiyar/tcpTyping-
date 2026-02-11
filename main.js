import { handleConn } from "./src/agent.js";

const main = async () => {
  const typingStats = {}; // change it to db or json
  const users = {}; // change it to db or json
  const listener = Deno.listen({
    port: 8000,
  });

  console.log("server started : ");
  for await (const conn of listener) {
    console.log("connection established");

    handleConn(conn, typingStats, users);
  }
};
main();
