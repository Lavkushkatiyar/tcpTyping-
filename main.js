import { connectToServer, getUserDetails } from "./src/client.js";
import { startServer } from "./src/serverPrototype.js";

const encoder = new TextEncoder();
const decoder = new TextDecoder();
const HOSTNAME = "127.0.0.1";
const PORT = 8000;

const main = async (HOSTNAME, PORT) => {
  startServer(HOSTNAME, PORT);
  const buffer = new Uint8Array(1024);
  const userConnection = await connectToServer(HOSTNAME, PORT);

  const userCredentials = JSON.stringify(getUserDetails());
  // userConnection.write(encoder.encode(userCredentials));

  userConnection.write(encoder.encode("fetchParagraph"));
  userConnection.read(buffer);
  console.log(decoder.decode(buffer));
};
main(HOSTNAME, PORT);
