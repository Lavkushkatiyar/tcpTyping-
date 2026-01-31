export const connectToServer = (hostname, port) => {
  const userConnection = Deno.connect({
    hostname,
    port,
    transport: "tcp",
  });
  return userConnection;
};
export const getUserDetails = () => {
  const userName = "LAVKUSH";
  const command = "Create";
  const password = "1234";
  return { userName, command, password };
};
