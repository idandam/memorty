import uniqueNumbers from "./uniqueNumbers";

const commaSeparatedNumberListRegExp = /^\d(\d)*(,\d(\d)*)*$/;
const base = "https://rickandmortyapi.com/api/character/";

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
  let url = new URL(base);
  if (path) {
    if (commaSeparatedNumberListRegExp.test(path)) {
      url.pathname = url.pathname.concat(path);
    } else if (path.includes("=")) {
      new URLSearchParams(path).forEach((value, key) => {
        url.searchParams.set(key, value);
      });
    }
  }
  return url;
};

//  (characterName, numOfCards)
const httpReq = (url, numOfCards) => {
  if (!isNaN(url.href[url.href.length - 1])) {
    return fetch(url)
      .then((response) => response.json())
      .then((characters) => {
        return getCardModels(characters);
      });
  } else if (url.searchParams.has("page") && url.searchParams.has("name")) {
    return fetch(url)
      .then((response) => response.json())
      .then((data) => {
        const characterIds = uniqueNumbers(numOfCards, data.results.length);
        const cards = getCardModels(data.results, characterIds);
        return { cards, page: url.searchParams.get("page") };
      });
  } else if (url.searchParams.has("name")) {
    console.log(url.href);
    return fetch(url)
      .then((response) => {
        return response.json();
      })
      .then((character) => {
        let page = Math.floor(Math.random() * character.info.pages) + 1;
        return httpReq(
          buildURL(
            `page=${page}&name=${url.searchParams.get("name")}`,
            numOfCards
          )
        );
      });

    // This means that the request is for the characters count
  } else if (!numOfCards) {
    return fetch(url)
      .then((response) => response.json())
      .then((allCharacters) => allCharacters.info.count);
    // if true then the end-point is a comma separated list of numbers
  }
};

export default httpReq;
