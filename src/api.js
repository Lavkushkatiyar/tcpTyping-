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

export const addCredentials = (usersCredentials, users) => {
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
  return createSuccessResponse({
    userId: usersCredentials.userId,
    userName: users[usersCredentials.userId].userName,
  });
};

const getRandomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const fetchPara = (paragraphs) => {
  const randomId = getRandomNumber(1, paragraphs.length);
  return createSuccessResponse(paragraphs.paragraphs[randomId]);
};

export const addUser = (users, data) => {
  if (data.userId === undefined) {
    return createFailureResponse({
      errorCode: 11,
      errorMessage: `Error: userId is undefined`,
    });
  }

  if (data.userName === undefined) {
    return createFailureResponse({
      errorCode: 11,
      errorMessage: `Error: userName is undefined`,
    });
  }

  users[data.userId] = {
    userName: data.userName,
    stats: {
      "grossWPM": 0,
      "rawWPM": 0,
      "accuracy": 0,
    },
  };

  return createSuccessResponse({ userId: data.userId, ...users[data.userId] });
};

export const fetchUsers = (users) => {
  return createSuccessResponse(users);
};

export const updateUserStats = (users, userId, data) => {
  if (!(userId in users)) {
    return createFailureResponse({
      errorCode: 12,
      errorMessage: `Error: user ${userId} doesn't exist`,
    });
  }

  users[userId].stats = data.stats;
  return createSuccessResponse({ userId, ...users[userId] });
};
