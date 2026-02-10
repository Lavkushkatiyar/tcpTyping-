import { beforeEach, describe, it } from "@std/testing/bdd";
import { assertEquals } from "@std/assert";
import {
  createUser,
  getStats,
  updateUserStats,
} from "../src/user/user_services.js";

describe("typing-monkey", () => {
  describe("addUserCredentials", () => {
    let users;
    let typingStats;
    beforeEach(() => {
      users = {};
      typingStats = {};
    });

    it("add user credentials successfully", () => {
      const usersCredentials = {
        userName: "someone",
        password: "12345",
        userId: "someone123",
      };
      const response = createUser(usersCredentials, users, typingStats);
      assertEquals(response, {
        success: true,
        body: {
          userId: "someone123",
          userName: "someone",
        },
        error: {},
      });
      assertEquals(users, {
        "someone123": { userName: "someone", password: "12345" },
      });
    });
    it("user already exist", () => {
      const usersCredentials = {
        userName: "someone",
        password: "12345",
        userId: "someone123",
      };
      assertEquals(createUser(usersCredentials, users, typingStats), {
        success: true,
        body: {
          userId: "someone123",
          userName: "someone",
        },
        error: {},
      });
      assertEquals(users, {
        "someone123": { userName: "someone", password: "12345" },
      });
      assertEquals(createUser(usersCredentials, users, typingStats), {
        success: false,
        body: {},
        error: {
          errorCode: 10,
          errorMessage: `userId ${usersCredentials.userId} already exist`,
        },
      });
      assertEquals(users, {
        "someone123": { userName: "someone", password: "12345" },
      });
    });
  });

  describe("update user", () => {
    let users;
    let typingStats;
    beforeEach(() => {
      users = {};
      typingStats = {};
    });

    it("updates user stats", () => {
      createUser({ userName: "abc", userId: "abc123" }, users, typingStats);
      createUser(
        { userName: "someone", userId: "someone123" },
        users,
        typingStats,
      );
      const userId = "abc123";
      const stats = {
        "grossWPM": 1,
        "rawWPM": 1,
        "accuracy": 1,
      };

      assertEquals(updateUserStats(typingStats, userId, stats), {
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
        updateUserStats(typingStats, userId, {
          "grossWPM": 1,
          "rawWPM": 1,
          "accuracy": 1,
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

  describe("getStats", () => {
    const typingStats = {
      "abc123": {
        userName: "abc",
        stats: {
          "grossWPM": 0,
          "rawWPM": 0,
          "accuracy": 0,
        },
      },
    };
    it("get stats", () => {
      const response = getStats(typingStats);
      assertEquals(response.success, true);
    });
  });
});
