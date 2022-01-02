import { getCardModels } from "./cardsRequests";
import buildURL from "./buildURL";

import uniqueNumbers from "../utils/uniqueNumbers";

const fetchCharactersByIds = (url) => {
  return fetch(url)
    .then((response) => response.json())
    .then((characters) => {
      return getCardModels(characters);
    });
};

const fetchCharacterByPage = (url, numOfCards) => {
  return fetch(url)
    .then((response) => response.json())
    .then((data) => {
      const characterIds = uniqueNumbers(numOfCards, data.results.length);
      const cards = getCardModels(data.results, characterIds);
      return { cards, page: url.searchParams.get("page") };
    });
};

const fetchCharacterPage = (url) => {
  return fetch(url)
    .then((response) => {
      return response.json();
    })
    .then((character) => Math.floor(Math.random() * character.info.pages) + 1);
};

const fetchCharacterCount = (url) => {
  return fetch(url)
    .then((response) => response.json())
    .then((allCharacters) => allCharacters.info.count);
};

const httpReq = (url, numOfCards) => {
  if (!isNaN(url.href[url.href.length - 1])) {
    return fetchCharactersByIds(url);
  }
  if (url.searchParams.has("page") && url.searchParams.has("name")) {
    return fetchCharacterByPage(url, numOfCards);
  }
  if (url.searchParams.has("name")) {
    return fetchCharacterPage(url).then((page) => {
      return httpReq(
        buildURL(`page=${page}&name=${url.searchParams.get("name")}`),
        numOfCards
      );
    });
  }
  // This means that the request is for the characters count
  if (!numOfCards) {
    return fetchCharacterCount(url);
  }
};

export default httpReq;
