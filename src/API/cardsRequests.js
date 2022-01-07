import {
  LEVELS,
  LEVEL_FIVE_CARDS,
  LEVEL_SIX_CARDS,
  CARDS_TO_ADD,
} from "../constants/constants";

import buildURL from "./buildURL";
import httpReq from "./httpReq";

import uniqueNumbers from "../utils/uniqueNumbers";
import randomNumber from "../utils/randomNumber";

// There're two different fetches.

// The first one is when the end-point is a list of known character ids. Here
// the request was for characters with these ids.
// In this case ids will be falsy .

// The second request is for character ids. Then we chose characters from
// a known set of characters such that a subset of them have the ids,
// so ids[0, 1 ,..., ids.length - 1] will be contained in {cid_1, cid_2, ..., cid_characters.length},
// such that cid_j is the id of character j
// In this case ids will be truthy.
export const getCardModels = (characters, ids) => {
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

export const getCards = (level, characterCount) => {
  let characterIds;
  if (level.val < LEVELS - 1) {
    let numOfCards = level.val * CARDS_TO_ADD;
    characterIds = uniqueNumbers(numOfCards, characterCount);
    return httpReq(buildURL(`${characterIds.join(",")}`), numOfCards);
  }

  // Else there's an initial request for ricks and morties cards;
  let numOfCards =
    level.val === LEVELS - 1 ? LEVEL_FIVE_CARDS / 2 : LEVEL_SIX_CARDS / 2;
  return getRicksAndMortiesCards(numOfCards);
};

export const getRicksAndMortiesCards = (numOfCards, pages) => {
  let ricksAndMorties = [],
    totalNumOfCards = numOfCards * 2;

  let url = buildURL(`${pages ? `page=${pages[0]}&` : ""}name=rick`);
  if (url) {
  }
  return Promise.all([
    httpReq(
      buildURL(`${pages ? `page=${pages[0]}&` : ""}name=rick`),
      numOfCards
    ),
    httpReq(
      buildURL(`${pages ? `page=${pages[1]}&` : ""}name=morty`),
      numOfCards
    ),
  ]).then((results) => {
    let ricks = results[0].cards,
      morties = results[1].cards;

    ricksAndMorties = ricksAndMorties.concat(ricks).concat(morties);

    if (ricksAndMorties.length > totalNumOfCards) {
      ricksAndMorties = ricksAndMorties.slice(
        0,
        ricksAndMorties.length - totalNumOfCards
      );
    }
    // If one of the page was the last one then this will be true
    // since there will not be enough cards in these pages
    else if (ricksAndMorties.length < totalNumOfCards) {
      let ricksPage = randomNumber(1, results[0].pages, +results[0].page);
      let mortiesPage = randomNumber(1, results[1].pages, +results[1].page);

      numOfCards = Math.ceil((totalNumOfCards - ricksAndMorties.length) / 2);

      return getRicksAndMortiesCards(numOfCards, [ricksPage, mortiesPage])
        .then((cards) => {
          return ricksAndMorties.concat(cards);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      return ricksAndMorties;
    }
  });
};
