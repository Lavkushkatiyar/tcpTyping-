const parseResponse = async (response) => {
  const data = await response.json();
  return data[0].q.trim().split(" ");
};

const buildWords = (text, length) => text.slice(0, length).join(" ");

export const getParagraph = async (length = 40) => {
  const localParagraph =
    "The quick brown fox jumps over the lazy dog while morning light spills across the quiet street, and a distant bell marks the hour.";
  try {
    const url = "https://zenquotes.io/api/random";
    const response = await fetch(url);

    if (!response.ok) {
      return JSON.stringify(getLocalParagraph(length, paragraphs));
    }

    const text = await parseResponse(response);
    return buildWords(text, length);
  } catch {
    return localParagraph;
  }
};
