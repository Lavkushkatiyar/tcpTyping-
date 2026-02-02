// import { startTypingSession } from "./typing-simulator.js";
import { calculateWPM, countIncorrectWords, displayWPM } from "./utils.js";

const main = () => {
  const paragraph = userSession.paragraph;
  const startTime = Date.now();

  const userTypedWords = userSession.typedWords;

  const endTime = Date.now();

  const incorrectWords = countIncorrectWords(userTypedWords, paragraph);

  const typingMetrics = calculateWPM(
    startTime,
    endTime,
    paragraph,
    incorrectWords,
  );

  displayWPM(typingMetrics);
  return typingMetrics;
};

main(40);
