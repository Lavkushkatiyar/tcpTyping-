export const calculateWPM = (start, end, paragraph, noOfWrongWords) => {
  const totalWords = paragraph.split(" ").length;
  const correctWords = totalWords - noOfWrongWords;
  const durationMinutes = ((end - start) / 1000) / 60;

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

export const countIncorrectWords = (typedCharacters, referenceParagraph) => {
  const typedSentence = typedCharacters.join("");

  const typedWords = typedSentence.split(" ");

  const referenceWords = referenceParagraph.split(" ");

  const maxWordCount = Math.max(
    typedWords.length,
    referenceWords.length,
  );

  const typedWordsBuffer = Array.from({ length: maxWordCount })
    .map((_, index) => typedWords[index]);

  const incorrectWordCount = typedWordsBuffer
    .filter((typedWord, index) => typedWord !== referenceWords[index])
    .length;

  return incorrectWordCount;
};
