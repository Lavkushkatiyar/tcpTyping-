import { describe, it } from "@std/testing/bdd";
import { assertEquals } from "@std/assert";

import {
  calculateWPM,
  countIncorrectWords,
  formatTypingStats,
} from "../src/typing_metrics.js";

describe("typing_metrics", () => {
  it("should calculate gross WPM correctly", () => {
    const res = calculateWPM(0, 60000, "hello world test", 1);
    assertEquals(Math.round(res.grossWPM), 2);
  });

  it("should calculate accuracy percentage correctly", () => {
    const res = calculateWPM(0, 60000, "hello world test", 1);
    assertEquals(Math.round(res.accuracy), 67);
  });

  it("should format gross WPM to two decimals in the message", () => {
    const message = formatTypingStats({
      grossWPM: 45.678,
      rawWPM: 50,
      accuracy: 90,
    });
    assertEquals(message.includes("45.68 WPM"), true);
  });

  it("should include accuracy percentage in the message", () => {
    const message = formatTypingStats({
      grossWPM: 40,
      rawWPM: 42,
      accuracy: 95,
    });
    assertEquals(message.includes("95 %"), true);
  });

  it("should return zero incorrect words when input matches reference", () => {
    assertEquals(
      countIncorrectWords("hello world".split(""), "hello world"),
      0,
    );
  });

  it("should count incorrect words when input differs from reference", () => {
    assertEquals(
      countIncorrectWords("hello wurld".split(""), "hello world"),
      1,
    );
  });
});
