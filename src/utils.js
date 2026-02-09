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
  const userWordsContainer = Array.from({ length: paragraph.length }); // [better name required]

  const sentence = userInputs.join("");

  const userWords = sentence.split(" "); //user typed

  for (let index = 0; index < userWords.length; index++) { // [can be optimized with maybe map]
    userWordsContainer[index] = userWords[index];
  }

  const actualWords = paragraph.split(" "); //original

  const incorrectWords = userWordsContainer.filter((word, index) =>
    word !== actualWords[index]
  );

  return incorrectWords.length;
};
