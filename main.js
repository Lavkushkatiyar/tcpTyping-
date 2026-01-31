import { connectToServer, getUserDetails } from "./src/client.js";
const HOSTNAME = "127.0.0.1";
const PORT = 8000;
const main = async (HOSTNAME, PORT) => {
  const userCredentials = getUserDetails();
  const userConnection = await connectToServer(HOSTNAME, PORT);
  await userConnection.write(userCredentials);
};
main(HOSTNAME, PORT);
