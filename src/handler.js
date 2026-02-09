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

export const createUser = (usersCredentials, users, typingStats) => {
  if (usersCredentials.userId === undefined) {
    return createFailureResponse({
      errorCode: 11,
      errorMessage: `Error: userId is undefined`,
    });
  }

  if (usersCredentials.userId in users) {
    return createFailureResponse({
      errorCode: 10,
      errorMessage: `Error: userId ${usersCredentials.userId} already exist`,
    });
  }

  users[usersCredentials.userId] = {
    userName: usersCredentials.userName,
    password: usersCredentials.password,
  };

  typingStats[usersCredentials.userId] = {
    userName: usersCredentials.userName,
    stats: {
      "grossWPM": 0,
      "rawWPM": 0,
      "accuracy": 0,
    },
  };

  return createSuccessResponse({
    userId: usersCredentials.userId,
    userName: users[usersCredentials.userId].userName,
  });
};

export const isUserExist = (usersCredentials, users) => {
  return usersCredentials.userId in users;
};

export const validateUser = (usersCredentials, users) => {
  const isUser = isUserExist(usersCredentials, users);

  const user = users[usersCredentials.userId];

  const isValidPassword = usersCredentials.password === user.password;

  if (isUser && isValidPassword) {
    return createSuccessResponse({
      userId: usersCredentials.userId,
      userName: users[usersCredentials.userId].userName,
    });
  }
  return createFailureResponse({ error: "User doesn't exist " });
};

export const updateUserStats = (typingStats, userId, data) => {
  if (!(userId in typingStats)) {
    return createFailureResponse({
      errorCode: 12,
      errorMessage: `Error: user ${userId} doesn't exist`,
    });
  }
  typingStats[userId].stats = data;

  return createSuccessResponse({ userId, ...typingStats[userId] });
};
