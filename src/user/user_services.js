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
  if (usersCredentials.userId in users) {
    return createFailureResponse({
      errorCode: 10,
      errorMessage: `userId ${usersCredentials.userId} already exist`,
    });
  }

  users[usersCredentials.userId] = {
    userName: usersCredentials.userName,
    password: usersCredentials.password,
  };

  typingStats[usersCredentials.userId] = {
    userName: usersCredentials.userName,
    stats: {
      grossWPM: 0,
      rawWPM: 0,
      accuracy: 0,
    },
  };

  return createSuccessResponse({
    userId: usersCredentials.userId,
    userName: users[usersCredentials.userId].userName,
  });
};

export const doesUserExist = (usersCredentials, users) => {
  return usersCredentials.userId in users;
};

export const validateUser = (usersCredentials, users) => {
  const isUser = doesUserExist(usersCredentials, users);
  const user = users[usersCredentials.userId];

  if (isUser && usersCredentials.password === user.password) {
    return createSuccessResponse({
      userId: usersCredentials.userId,
      userName: user.userName,
    });
  }

  return createFailureResponse({
    errorCode: 12,
    errorMessage: "User doesn't exist",
  });
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

export const getStats = (typingStats) => {
  return createSuccessResponse(typingStats);
}
