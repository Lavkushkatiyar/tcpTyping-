const getLocalParagraph = (length = 40, paragraphs) => {
  const randomIndex = Math.floor(Math.random() * paragraphs.length);
  const text = paragraphs[randomIndex];
  console.log(text);
  return text.slice(0, length);
};

const parseResponse = async (response) => {
  const data = await response.json();
  return data[0].q.trim().split(" ");
};

const buildWords = (text, length) => text.slice(0, length).join(" ");

export const getParagraph = async (length = 40) => {
  const paragraphs = localParagraphs();
  console.log(paragraphs);

  try {
    const url = "https://zenquotes.io/api/random";
    const response = await fetch(url);

    if (!response.ok) {
      return getLocalParagraph(length, paragraphs);
    }

    const text = await parseResponse(response);
    return buildWords(text, length);
  } catch {
    return getLocalParagraph(length, paragraphs);
  }
};
