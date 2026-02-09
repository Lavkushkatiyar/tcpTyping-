import { describe, it } from "@std/testing/bdd";
import { assertEquals } from "@std/assert";
import { getTypingStats } from "../src/typing_stats.js";

describe("typing_metrics", () => {
  it("should calculate gross WPM correctly", () => {
    const originalNow = Date.now;
    Date.now = () => 60000;
    const response = getTypingStats({
      paragraph: "hello world test",
      startTime: 0,
      userTypedWords: "hello world test".split(""),
    });
    Date.now = originalNow;
    assertEquals(Math.round(response.grossWPM), 3);
  });

  it("should calculate accuracy percentage correctly when one word is wrong", () => {
    const originalNow = Date.now;
    Date.now = () => 60000;
    const response = getTypingStats({
      paragraph: "hello world test",
      startTime: 0,
      userTypedWords: "hello wurld test".split(""),
    });
    Date.now = originalNow;
    assertEquals(Math.round(response.accuracy), 67);
  });

  it("should calculate raw WPM based on paragraph word count", () => {
    const originalNow = Date.now;
    Date.now = () => 60000;
    const response = getTypingStats({
      paragraph: "hello world",
      startTime: 0,
      userTypedWords: "hello world extra".split(""),
    });
    Date.now = originalNow;
    assertEquals(Math.round(response.rawWPM), 2);
  });
});
