import Cards from "./components/Cards/Cards";
import shuffle from "./utils/shuffle";
import uniqueNumbers from "./utils/uniqueNumbers";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import Dialog from "./components/UI/Dialog";

import { useReducer, useState } from "react";
import { useEffect } from "react";

import httpReq from "./API/httpReq";
import { NUMBER_LIST_REG_EXP } from "./constants/constants";
import { BASE } from "./constants/constants";
import { LEVELS } from "./constants/constants";
import { CARDS_TO_ADD } from "./constants/constants";

import "./App.css";

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

const getCards = (level, characterCount, rickAndMortiesData) => {
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

const getLastLevelCards = (level) => {
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
function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [characterCount, setCharacterCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    httpReq(buildURL()).then((characterCount) => {
      setCharacterCount(characterCount);
    });
  }, []);

  useEffect(() => {
    if (!characterCount) {
      return;
    }
    setLoading(true);

    getCards(state.level, characterCount).then((cards) => {
      console.log("in use effect", cards);
      dispatch({ type: "NEW_CARDS", cards });
      setLoading(false);
    });
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
