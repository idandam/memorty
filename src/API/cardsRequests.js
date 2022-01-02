import { LEVELS } from "../constants/constants";
import { CARDS_TO_ADD } from "../constants/constants";

import buildURL from "./buildURL";
import httpReq from "./httpReq";

import uniqueNumbers from "../utils/uniqueNumbers";

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

export const getCards = (level, characterCount, rickAndMortiesData) => {
  let characterIds;
  if (level.val < LEVELS) {
    let numOfCards = level.val * CARDS_TO_ADD;
    characterIds = uniqueNumbers(numOfCards, characterCount);
    return httpReq(buildURL(`${characterIds.join(",")}`), numOfCards);
  }
  // Else we're at the final level
  // If the parameter will be truthy then there's a request for additional cards
  // of ricks or morties that will be added to an already exists ricks and morties cards
  if (rickAndMortiesData) {
    let { charactersData, numOfCards } = rickAndMortiesData;
    const cardsToAddData =
      charactersData.ricks.length < charactersData.morties.length
        ? { name: "rick", page: charactersData.ricksPage }
        : { name: "morty", page: charactersData.mortiesPage };

    // Number of remaining cards that we need to add
    numOfCards =
      2 * numOfCards -
      charactersData.ricks.length -
      charactersData.morties.length;
    // select a different page than the last one
    const newPage = Math.floor(Math.random() * (cardsToAddData.page - 1)) + 1;

    return httpReq(
      buildURL(`page=${newPage}&name=${cardsToAddData.name}`),
      numOfCards
    ).then((data) => data.cards);
  }
  // Else there's an initial request for ricks and morties cards;
  return getLastLevelCards(level);
};

export const getLastLevelCards = (level) => {
  let numOfCards = (level.val * CARDS_TO_ADD - 2) / 2,
    ricksAndMorties = [];

  return Promise.all([
    httpReq(buildURL("name=rick"), numOfCards),
    httpReq(buildURL("name=morty"), numOfCards),
  ]).then((results) => {
    let ricks = results[0].cards,
      morties = results[1].cards;

    ricksAndMorties = ricksAndMorties.concat(ricks).concat(morties);
    // If the page was the last one then this will be true
    // since there will not be enough cards in that page
    if (ricksAndMorties.length < numOfCards * 2) {
      return getCards(level, 0, {
        charactersData: {
          ricks,
          morties,
          ricksPage: results[0].page,
          mortiesPage: results[1].page,
        },
        numOfCards,
      })
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
