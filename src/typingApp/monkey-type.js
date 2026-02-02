import { getParagraph } from "./monkey-type.js";
import { startTypingSession } from "./typing-simulator.js";
import { calculateWPM, countIncorrectWords, displayWPM } from "./utils.js";

const main = async (length) => {
  const paragraph = await getParagraph(length);
  const startTime = Date.now();

  const userTypedWords = await startTypingSession(paragraph.split(""));

  const endTime = Date.now();

  const incorrectWords = countIncorrectWords(userTypedWords, paragraph);

  const typingMetrics = calculateWPM(
    startTime,
    endTime,
    paragraph,
    incorrectWords,
  );

  displayWPM(typingMetrics);
};

main(40);
