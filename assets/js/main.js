const selectTag = document.querySelectorAll("select");
const translateBtn = document.querySelector("button");
const fromText = document.querySelector(".from-text");
const toText = document.querySelector(".to-text");
const exchangeIcon = document.querySelector(".exchange");
const icons = document.querySelectorAll(".row i");

selectTag.forEach((tag, id) => {
  for (const country_code in countries) {
    let selected;

    if (id == 0 && country_code == "en-GB") {
      selected = "selected";
    } else if (id == 1 && country_code == "tr-TR") {
      selected = "selected";
    }

    let option = `<option value="${country_code}" ${selected}>${countries[country_code]}</option>`;
    tag.insertAdjacentHTML("beforeend", option);
  }
});

// Load saved data from local storage
window.addEventListener("load", () => {
  const savedFromLang = localStorage.getItem("fromLang");
  const savedToLang = localStorage.getItem("toLang");
  const savedFromText = localStorage.getItem("fromText");
  const savedToText = localStorage.getItem("toText");

  if (savedFromLang) selectTag[0].value = savedFromLang;
  if (savedToLang) selectTag[1].value = savedToLang;
  if (savedFromText) fromText.value = savedFromText;
  if (savedToText) toText.value = savedToText;
});

exchangeIcon.addEventListener("click", () => {
  let tempText = fromText.value;
  fromText.value = toText.value;
  toText.value = tempText;
  let tempLang = selectTag[0].value;
  selectTag[0].value = selectTag[1].value;
  selectTag[1].value = tempLang;

  // Save to local storage
  localStorage.setItem("fromLang", selectTag[0].value);
  localStorage.setItem("toLang", selectTag[1].value);
  localStorage.setItem("fromText", fromText.value);
  localStorage.setItem("toText", toText.value);
});

translateBtn.addEventListener("click", () => {
  let text = fromText.value;
  let translateFrom = selectTag[0].value;
  let translateTo = selectTag[1].value;
  if (!text) return;
  toText.setAttribute("placeholder", "Translating...");

  let apiUrl = `https://api.mymemory.translated.net/get?q=${text}!&langpair=${translateFrom}|${translateTo}`;
  fetch(apiUrl)
    .then((res) => res.json())
    .then((data) => {
      toText.value = data.responseData.translatedText;
      toText.setAttribute("placeholder", "Translation");

      // Save to local storage
      localStorage.setItem("fromLang", translateFrom);
      localStorage.setItem("toLang", translateTo);
      localStorage.setItem("fromText", text);
      localStorage.setItem("toText", data.responseData.translatedText);
    });
});

icons.forEach((icon) => {
  icon.addEventListener("click", ({ target }) => {
    if (target.classList.contains("fa-copy")) {
      if (target.id == "from") {
        navigator.clipboard.writeText(fromText.value);
      } else {
        navigator.clipboard.writeText(toText.value);
      }
    } else {
      let utterance;
      if (target.id == "from") {
        utterance = new SpeechSynthesisUtterance(fromText.value);
        utterance.lang = selectTag[0].value;
      } else {
        utterance = new SpeechSynthesisUtterance(toText.value);
        utterance.lang = selectTag[1].value;
      }
      speechSynthesis.speak(utterance);
    }
  });
});
