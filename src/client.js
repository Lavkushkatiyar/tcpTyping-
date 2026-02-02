const HOSTNAME = "127.0.0.1";
const PORT = 8000;
const encoder = new TextEncoder();
const decoder = new TextDecoder();
export const connectToServer = (hostname, port) => {
  const userConnection = Deno.connect({
    hostname,
    port,
    transport: "tcp",
  });
  return userConnection;
};
export const getUserDetails = () => {
  const command = "CREATE";
  const userName = "LAVKUSH";
  const userId = "LAV123";

  const password = "1234";

  const request = { command, data: { userName, password, userId } };
  return request;
};

const main = async (hostname, port) => {
  const connection = await connectToServer(hostname, port);

  const userDetails = JSON.stringify(getUserDetails());
  const request = JSON.stringify({ command: "FETCH_PARAGRAPH", data: {} });
  await connection.write(encoder.encode(request));

  const buffer = new Uint8Array(1024);
  const readBytes = await connection.read(buffer);

  console.log(decoder.decode(buffer).slice(0, readBytes));
};
main(HOSTNAME, PORT);
