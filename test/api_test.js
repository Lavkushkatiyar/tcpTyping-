import { beforeEach, describe, it } from "@std/testing/bdd";
import { assertEquals } from "@std/assert";
import {
  addUser,
  createUser,
  fetchUsers,
  updateUserStats,
} from "../src/api.js";

describe("typing-monkey", () => {
  describe("addUserCredentials", () => {
    let usersCredentials;
    beforeEach(() => usersCredentials = {});

    it("add user credentials successsfully", () => {
      const request = {
        userName: "someone",
        password: "12345",
        userId: "someone123",
      };
      assertEquals(createUser(request, usersCredentials), {
        success: true,
        body: {
          userId: "someone123",
          userName: "someone",
        },
        error: {},
      });
      assertEquals(usersCredentials, {
        "someone123": { userName: "someone", password: "12345" },
      });
    });
    it("user already exist", () => {
      const request = {
        userName: "someone",
        password: "12345",
        userId: "someone123",
      };
      assertEquals(createUser(request, usersCredentials), {
        success: true,
        body: {
          userId: "someone123",
          userName: "someone",
        },
        error: {},
      });
      assertEquals(usersCredentials, {
        "someone123": { userName: "someone", password: "12345" },
      });
      assertEquals(createUser(request, usersCredentials), {
        success: false,
        body: {},
        error: {
          errorCode: 10,
          errorMessage: `Error: userId ${request.userId} already exist`,
        },
      });
      assertEquals(usersCredentials, {
        "someone123": { userName: "someone", password: "12345" },
      });
    });
  });

  describe("addUser", () => {
    let users;
    beforeEach(() => users = {});

    it("create user successfully", () => {
      const data = {
        userId: "123",
        userName: "someone",
      };

      assertEquals(addUser(users, data), {
        success: true,
        body: {
          "userId": "123",
          "userName": "someone",
          "stats": {
            "grossWPM": 0,
            "rawWPM": 0,
            "accuracy": 0,
          },
        },
        error: {},
      });
    });
    it("userId is undefined", () => {
      assertEquals(addUser(users, { userName: "someone" }), {
        success: false,
        body: {},
        error: {
          errorCode: 11,
          errorMessage: `Error: userId is undefined`,
        },
      });
    });
    it("userName is undefined", () => {
      assertEquals(addUser(users, { userId: "123" }), {
        success: false,
        body: {},
        error: {
          errorCode: 11,
          errorMessage: `Error: userName is undefined`,
        },
      });
    });
    it("userId, userName are undefined", () => {
      assertEquals(addUser(users, {}), {
        success: false,
        body: {},
        error: {
          errorCode: 11,
          errorMessage: `Error: userId is undefined`,
        },
      });
    });
  });

  describe("fetchUsers", () => {
    let users;
    beforeEach(() => users = {});

    it("fetch users", () => {
      addUser(users, { userName: "abc", userId: "abc123" });
      addUser(users, { userName: "someone", userId: "someone123" });
      assertEquals(fetchUsers(users), {
        success: true,
        body: users,
        error: {},
      });
    });

    it("users not present", () => {
      assertEquals(fetchUsers(users), {
        success: true,
        body: users,
        error: {},
      });
    });
  });

  describe("update user", () => {
    let users;
    beforeEach(() => users = {});

    it("updates user stats", () => {
      addUser(users, { userName: "abc", userId: "abc123" });
      addUser(users, { userName: "someone", userId: "someone123" });
      const userId = "abc123";
      const data = {
        stats: {
          "grossWPM": 1,
          "rawWPM": 1,
          "accuracy": 1,
        },
      };

      assertEquals(updateUserStats(users, userId, data), {
        success: true,
        body: {
          "userId": "abc123",
          "userName": "abc",
          "stats": {
            "grossWPM": 1,
            "rawWPM": 1,
            "accuracy": 1,
          },
        },
        error: {},
      });
    });

    it("user doesn't exist", () => {
      const userId = "123";
      assertEquals(
        updateUserStats(users, userId, {
          stats: {
            "grossWPM": 1,
            "rawWPM": 1,
            "accuracy": 1,
          },
        }),
        {
          success: false,
          body: {},
          error: {
            errorCode: 12,
            errorMessage: `Error: user ${userId} doesn't exist`,
          },
        },
      );
    });
  });
});
