const localParagraphs = () => {
  const para1 =
    "A small café on the corner sold fresh bread every morning. Customers arrived with newspapers and umbrellas, traded stories with the baker, and left with paper bags warm from the oven.";

  const para2 =
    "The quick brown fox jumps over the lazy dog while morning light spills across the quiet street, and a distant bell marks the hour.";

  const para3 =
    "Typing practice builds speed and accuracy. Focus on correct finger placement, maintain rhythm, and improve one small step each day.";

  return [para1, para2, para3];
};

const randomIndex = Math.floor(Math.random() * 3);
export const fetchParagraph = () => localParagraphs()[randomIndex];
