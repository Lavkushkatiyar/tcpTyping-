import { getParagraph } from "../typingApp/paragraph-api.js";

const createSuccessResponse = (body) => ({
  success: true,
  body,
  error: {},
});

const createFailureResponse = (error) => ({
  success: false,
  body: {},
  error,
});

export const createUser = (users, request) => {
  if (request.userId in users) {
    return createFailureResponse({
      errorCode: 10,
      errorMessage: `Error: userId ${request.userId} already exist`,
    });
  }

  users[request.userId] = {
    userName: request.userName,
    password: request.password,
  };
  console.log({ users, request });

  return createSuccessResponse({
    userId: request.userId,
    userName: users[request.userId].userName,
  });
};

export const fetchPara = async () => {
  const paragraph = await getParagraph(40);

  return createSuccessResponse(paragraph);
};
export const startUserInput = () => {
  return "startTyping";
};
