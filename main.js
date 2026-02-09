import { handleConn } from "./src/agent.js";

const main = async () => {
  const listener = Deno.listen({
    port: 8000,
  });

  console.log("server started on hostname : 192.168.1.66");
  for await (const conn of listener) {
    console.log("connection established");
    handleConn(conn);
  }
};
main();
