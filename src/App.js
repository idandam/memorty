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
  CARDS_TO_ADD = 4;

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

const initalState = {
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
        // shuffle(cards);
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

const httpReq = (characterName, numOfCards) => {
  let page = 1;

  return fetch(
    `https://rickandmortyapi.com/api/character/?name=${characterName}`
  )
    .then((response) => {
      return response.json();
    })
    .then((character) => {
      page = Math.floor(Math.random() * character.info.pages) + 1;
      return fetch(
        `https://rickandmortyapi.com/api/character/?page=${page}&&name=${characterName}`
      );
    })
    .then((response) => response.json())
    .then((data) => {
      const characterIds = uniqueNumbers(
        numOfCards,
        Math.min(numOfCards, data.results.length)
      );

      const cards = [];

      characterIds.forEach((id) => {
        const character = data.results[id];
        cards.push({
          id: character.id,
          name: character.name,
          image: character.image,
          status: character.status,
          species: character.species,
        });
      });
      return { cards, page };
    });
};

function App() {
  const [state, dispatch] = useReducer(reducer, initalState);
  const [characterCount, setCharacterCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://rickandmortyapi.com/api/character")
      .then((response) => response.json())
      .then((allCharacters) => setCharacterCount(allCharacters.info.count))
      .catch((err) => console.log("ERROR fetching number of character"));
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
      fetch(
        `https://rickandmortyapi.com/api/character/${characterIds.join(",")}`
      )
        .then((response) => response.json())
        .then((characters) => {
          characters.forEach((character) =>
            cards.push({
              id: character.id,
              name: character.name,
              image: character.image,
              status: character.status,
              species: character.species,
            })
          );
          dispatch({ type: "NEW_CARDS", cards });
          setLoading(false);
        });
    }
    // current level is 5
    else {
      let numOfCards = (state.level.val * CARDS_TO_ADD - 2) / 2,
        ricksAndMorties = [],
        additionalCards = [];

      Promise.all([
        httpReq("rick", numOfCards),
        httpReq("morty", numOfCards),
      ]).then((results) => {
        let ricks = results[0].cards,
          morties = results[1].cards;
        ricksAndMorties = ricksAndMorties.concat(ricks).concat(morties);
        if (ricksAndMorties.length < numOfCards * 2) {
          const additionalCardsData =
            ricks.length < morties.length
              ? { name: "rick", data: results[0] }
              : { name: "morty", data: results[1] };

          numOfCards = numOfCards - additionalCardsData.data.cards.length;
          const newPage = Math.floor(
            Math.random() * (additionalCardsData.data.page - 1)
          );
          fetch(
            `https://rickandmortyapi.com/api/character/?page=${newPage}&&name=${additionalCardsData.name}`
          )
            .then((response) => response.json())
            .then((data) => {
              const characterIds = uniqueNumbers(
                numOfCards,
                data.results.length
              );
              characterIds.forEach((id) => {
                const character = data.results[id];
                additionalCards.push({
                  id: character.id,
                  name: character.name,
                  image: character.image,
                  status: character.status,
                  species: character.species,
                });
              });
            });
        }
        cards = ricksAndMorties.concat(additionalCards);
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
