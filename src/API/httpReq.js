import uniqueNumbers from "../utils/uniqueNumbers";

import { NUMBER_LIST_REG_EXP } from "../constants/constants";
import { BASE } from "../constants/constants";

// There're two different fetches.

// The first one is when the end-point is a list of known character ids. Here
// the request was for characters with these ids.
// In this case ids will be falsy .

// The second request is for character ids. Then we chose characters from
// a known set of characters such that a subset of them have the ids,
// so ids[0, 1 ,..., ids.length - 1] will be contained in {cid_1, cid_2, ..., cid_characters.length},
// such that cid_j is the id of character j
// In this case ids will be truthy.
const getCardModels = (characters, ids) => {
  const cards = [];
  const numOfCards = ids ? ids.length : characters.length;
  let i = 0;
  let character;
  while (i < numOfCards) {
    character = ids ? characters[ids[i]] : characters[i];
    cards.push({
      id: character.id,
      name: character.name,
      image: character.image,
      status: character.status,
      species: character.species,
    });

    i++;
  }
  return cards;
};

const buildURL = (path) => {
  let url = new URL(BASE);
  if (path) {
    if (NUMBER_LIST_REG_EXP.test(path)) {
      url.pathname = url.pathname.concat(path);
    } else if (path.includes("=")) {
      new URLSearchParams(path).forEach((value, key) => {
        url.searchParams.set(key, value);
      });
    }
  }
  return url;
};

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
