import { handleConn } from "./src/typing.js";

const main = async () => {
  const listener = Deno.listen({
    port: 8000,
  });

  console.log("server started on hostname 10.132.124.104");
  for await (const conn of listener) {
    console.log("connection established");
    handleConn(conn);
  }
};
main();
