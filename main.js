import { connectToServer, getUserDetails } from "./src/client.js";
import { startServer } from "./src/serverPrototype.js";

const encoder = new TextEncoder();
const HOSTNAME = "127.0.0.1";
const PORT = 8000;
const main = async (HOSTNAME, PORT) => {
  startServer(HOSTNAME, PORT);
  const userCredentials = JSON.stringify(getUserDetails());

  const userConnection = await connectToServer(HOSTNAME, PORT);
  await userConnection.write(encoder.encode(userCredentials));
};
main(HOSTNAME, PORT);
