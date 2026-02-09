export const calculateWPM = (start, end, paragraph, noOfWrongWords) => {
  const totalWords = paragraph.split(" ").length;
  const correctWords = totalWords - noOfWrongWords;
  const durationMinutes = ((end - start + 500) / 1000) / 60;

  const grossWPM = correctWords / durationMinutes;
  const rawWPM = totalWords / durationMinutes;
  const accuracy = correctWords / totalWords * 100;
  return { grossWPM, rawWPM, accuracy };
};

export const formatTypingStats = ({ grossWPM, rawWPM, accuracy }) => {
  const resultMessage = `Typing Results:\n
    Gross WPM : ${grossWPM.toFixed(2)} WPM\n
    Raw WPM   : ${rawWPM.toFixed(2)} WPM\n
    Accuracy  : ${accuracy} %`;

  return resultMessage;
};

export const countIncorrectWords = (userInputs, paragraph) => {
  const sentence = userInputs.join("");
  const words = sentence.split(" "); //user typed
  const actualWords = paragraph.split(" "); //original

  const incorrectWords = words.filter((word, index) =>
    word !== actualWords[index]
  );

  return incorrectWords.length;
};
