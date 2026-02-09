import { calculateWPM, countIncorrectWords } from "./utils.js";

export const getTypingStats = ({ paragraph, startTime, userTypedWords }) => {
  const endTime = Date.now();

  const incorrectWords = countIncorrectWords(userTypedWords, paragraph);

  const typingMetrics = calculateWPM(
    startTime,
    endTime,
    paragraph,
    incorrectWords,
  );

  // const stats = formatTypingStats(typingMetrics);
  return typingMetrics;
};
