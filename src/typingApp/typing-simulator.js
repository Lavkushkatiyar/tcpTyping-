import { brightRed, brightYellow, gray } from "jsr:@std/fmt/colors";

const renderTypingContent = (paragraph, typingSession) => {
  console.clear();
  const remaining = gray(paragraph.slice(typingSession.cursor).join(""));
  const typed = typingSession.renderedOutput.join("");
  console.log(typed + remaining);
};

const handleBackspace = (typingSession) => {
  if (typingSession.cursor === 0) return 0;
  typingSession.renderedOutput.pop();
  typingSession.userChars.pop();
  return -1;
};

const formatComparedChar = (userChar, paragraphChar) =>
  userChar === paragraphChar ? brightYellow(userChar) : brightRed(userChar);

const readUserChar = async () => {
  const buffer = new Uint8Array(1);

  const bytesRead = await Deno.stdin.read(buffer);

  return new TextDecoder().decode(buffer.slice(0, bytesRead));
};

const isBackspace = (inputChar) => inputChar === "\x7f";

const handleNormalChar = (inputChar, paragraph, typingSession) => {
  const paragraphChar = paragraph[typingSession.cursor];
  typingSession.userChars.push(inputChar);
  typingSession.renderedOutput.push(
    formatComparedChar(inputChar, paragraphChar),
  );
  return 1;
};

const processInputChar = (inputChar, paragraph, typingSession) =>
  isBackspace(inputChar)
    ? handleBackspace(typingSession)
    : handleNormalChar(inputChar, paragraph, typingSession);

export const startTypingSession = async (paragraph) => {
  Deno.stdin.setRaw(true, { cbreak: true });

  const typingSession = {
    cursor: 0,
    renderedOutput: [],
    userChars: [],
  };

  renderTypingContent(paragraph, typingSession);

  while (typingSession.cursor < paragraph.length) {
    const inputChar = await readUserChar();
    const cursorDelta = processInputChar(inputChar, paragraph, typingSession);
    typingSession.cursor += cursorDelta;

    renderTypingContent(paragraph, typingSession);
  }

  return typingSession.userChars;
};
