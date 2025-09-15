// replaces some characters in word with other characters
function inhanceSearch(word) {
  const replacementMap = {
    أ: "ا",
    إ: "ا",
    ء: "ا",
    آ: "ا",
    ء: "ا",
    ئ: "ا",
    ؤ: "ا",
    ط: "ت",
    ى: "ي",
    ة: "ه",
    ذ: "ز",
    ".": "",
    " ": "",
  };
  return word.replace(/[أآإءةذ. ىئؤط]/g, function (match) {
    return replacementMap[match];
  });
}

export default inhanceSearch;
