import { calculateWPM, countIncorrectWords } from "./typing_metrics.js";

export const getTypingStats = ({ paragraph, startTime, userTypedWords }) => {
  const endTime = Date.now();

  const incorrectWords = countIncorrectWords(userTypedWords, paragraph);

  const typingMetrics = calculateWPM(
    startTime,
    endTime,
    paragraph,
    incorrectWords,
  );
  return typingMetrics;
};
