import { getCardModels } from "./cardsRequests";
import buildURL from "./buildURL";

import uniqueNumbers from "../utils/uniqueNumbers";

const fetchData = (url) => {
  return fetch(url).then((response) => {
    if (!response.ok) {
      throw new Error();
    }
    return response.json();
  });
};

const fetchCharactersByIds = (url) => {
  return fetchData(url).then((characters) => {
    return getCardModels(characters);
  });
};

const fetchCharacterByPage = (url, numOfCards) => {
  return fetchData(url).then((characterData) => {
    const characterIds = uniqueNumbers(
      numOfCards,
      characterData.results.length
    );
    const cards = getCardModels(characterData.results, characterIds);
    return {
      cards,
      page: url.searchParams.get("page"),
      pages: characterData.info.pages,
    };
  });
};

const fetchCharacterPage = (url) => {
  return fetchData(url).then(
    (character) => Math.floor(Math.random() * character.info.pages) + 1
  );
};

const fetchCharacterCount = (url) => {
  return fetchData(url).then((allCharacters) => allCharacters.info.count);
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
