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
