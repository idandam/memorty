import Cards from "./components/Cards/Cards";
import shuffle from "./utils/shuffle";
import uniqueNumbers from "./utils/uniqueNumbers";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import Dialog from "./components/UI/Dialog";

import { useReducer, useState } from "react";
import { useEffect } from "react";

import "./App.css";

const LEVELS = 5,
  CARDS_TO_ADD = 4,
  base = "https://rickandmortyapi.com/api/character/",
  commaSeparatedNumberListRegExp = /^\d(\d)*(,\d(\d)*)*$/;

const resetClicks = (cards) => {
  let clicked = {};
  cards.forEach((card) => {
    clicked[card.id] = false;
  });
  return clicked;
};

const nextLevelIndicator = (level) => {
  if (1 <= level && level < LEVELS) {
    return 2 * level * (level + 1);
  } else if (level === LEVELS) {
    return 2 * level * (level + 1) - 2;
  }

  throw new Error("Non-valid level: " + level);
};

const isWin = (level, currScore) => {
  return level === LEVELS && currScore === nextLevelIndicator(level) - 1;
};

const initialState = {
  cards: [],
  clicked: {},
  currScore: 0,
  bestScore: 0,
  level: { val: 5 },
  isWin: false,
  isLose: false,
};

const reducer = (prevState, action) => {
  let currScore = prevState.currScore,
    level = prevState.level,
    clicked = { ...prevState.clicked },
    bestScore = prevState.bestScore,
    cards = prevState.cards,
    isWin = prevState.isWin,
    isLose = prevState.isLose;

  switch (action.type) {
    case "NEW_CARDS":
      shuffle(action.cards);
      cards = action.cards;
      clicked = resetClicks(action.cards);
      break;

    case "HIT":
      clicked[action.id] = true;
      currScore = currScore + 1;
      // If reached to next level
      if (currScore === nextLevelIndicator(level.val)) {
        // if didn't reach max level
        if (level.val < LEVELS) {
          level = { val: level.val + 1 };
        }

        // shuffle existing cards
      } else {
        shuffle(cards);
      }
      if (currScore > bestScore) {
        bestScore = currScore;
      }
      break;

    case "MISS":
      isLose = true;
      break;

    case "WIN":
      isWin = true;
      currScore = currScore + 1;
      break;

    case "NEW_GAME":
      level = { val: 1 };
      currScore = 0;
      isWin = isLose = false;
      break;

    default:
      throw new Error("Unexpected action after dispatch");
  }
  return { cards, clicked, currScore, bestScore, level, isWin, isLose };
};
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
const httpReq = (characterName, numOfCards) => {
  let page = 1;

  return fetch(buildURL(`name=${characterName}`))
    .then((response) => {
      return response.json();
    })
    .then((character) => {
      page = Math.floor(Math.random() * character.info.pages) + 1;
      return fetch(buildURL(`page=${page}&name=${characterName}`));
    })
    .then((response) => response.json())
    .then((data) => {
      const characterIds = uniqueNumbers(numOfCards, data.results.length);
      const cards = getCardModels(data.results, characterIds);
      return { cards, page };
    });
};

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [characterCount, setCharacterCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // delete all and replace with
    // let count = httpReq()
    // setCharacterCount(count)
    fetch(buildURL())
      .then((response) => response.json())
      .then((allCharacters) => setCharacterCount(allCharacters.info.count));
  }, []);

  useEffect(() => {
    if (!characterCount) {
      return;
    }
    setLoading(true);
    let characterIds,
      cards = [];

    if (state.level.val < LEVELS) {
      characterIds = uniqueNumbers(
        state.level.val * CARDS_TO_ADD,
        characterCount
      );
      // delete all until
      fetch(buildURL(`${characterIds.join(",")}`))
        .then((response) => response.json())
        .then((characters) => {
          // here and add  replace the line below with
          // httpReq(buildURL(`${characterIds.join(",")}`)).then(cardsModels=> cards = getCardModels(characters); )
          cards = getCardModels(characters);
          dispatch({ type: "NEW_CARDS", cards });
          setLoading(false);
        });
    }
    // current level is 5
    else {
      let numOfCards = (state.level.val * CARDS_TO_ADD - 2) / 2,
        ricksAndMorties = [];

      Promise.all([httpReq("rick", numOfCards), httpReq("morty", numOfCards)])
        .then((results) => {
          let ricks = results[0].cards,
            morties = results[1].cards;
          ricksAndMorties = ricksAndMorties.concat(ricks).concat(morties);
          if (ricksAndMorties.length < numOfCards * 2) {
            const additionalCardsData =
              ricks.length < morties.length
                ? { name: "rick", page: results[0].page }
                : { name: "morty", page: results[1].page };

            numOfCards = 2 * numOfCards - ricksAndMorties.length;
            const newPage = Math.floor(
              Math.random() * (additionalCardsData.page - 1)
            );
            return fetch(
              buildURL(`page=${newPage}&name=${additionalCardsData.name}`)
            )
              .then((response) => response.json())
              .then((data) => {
                // const characterIds = uniqueNumbers(numOfCards, data.results.length);
                // const cards = getCardModels(data.results, characterIds);
                // return { cards, page };
                const characterIds = uniqueNumbers(
                  numOfCards,
                  data.results.length
                );

                const additionalCards = getCardModels(
                  data.results,
                  characterIds
                );
                // delete all htppReq code above
                // replace the line below with
                // let additionalards =
                //  buildURL(`page=${newPage}&name=${additionalCardsData.name}`)
                //  .then(cards= > { return ricksAndMorties.concat} )

                return ricksAndMorties.concat(additionalCards);
              })
              .catch((err) => {
                console.log(err);
              });
          } else {
            return ricksAndMorties;
          }
        })
        .then((cards) => {
          dispatch({ type: "NEW_CARDS", cards });
          setLoading(false);
        });
    }
  }, [state.level, characterCount]);

  const cardClickHandler = (id) => {
    if (state.clicked[id]) {
      dispatch({ type: "MISS", id });
    } else {
      if (isWin(state.level.val, state.currScore)) {
        dispatch({ type: "WIN" });
      } else {
        dispatch({ type: "HIT", id });
      }
    }
  };

  const newGameHandler = () => {
    dispatch({ type: "NEW_GAME" });
  };

  return (
    <div className="container">
      <Header
        currScore={state.currScore}
        level={state.level.val}
        bestScore={state.bestScore}
        isLose={state.isLose}
        onNewGame={newGameHandler}
      />
      {!loading && !state.isWin && !state.isLose && (
        <Cards
          cards={state.cards}
          level={state.level.val}
          onCardClick={cardClickHandler}
        />
      )}
      {!loading && state.isLose && (
        <Cards
          cards={state.cards}
          level={state.level.val}
          notClicked={Object.getOwnPropertyNames(state.clicked).filter(
            (id) => !state.clicked[id]
          )}
        />
      )}

      {loading && <div className="loader" />}
      {state.isWin && (
        <Dialog
          title="Win!"
          body={
            <>
              Great job!.
              <br />
              You've finished all the levels.
            </>
          }
          actionText="PLAY AGAIN"
          onNewGame={newGameHandler}
        />
      )}
      <Footer />
    </div>
  );
}

export default App;
