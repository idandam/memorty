import Cards from "./components/Cards/Cards";
import shuffle from "./utils/shuffle";
import uniqueNumbers from "./utils/uniqueNumbers";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";

import { useReducer, useState } from "react";
import { useEffect } from "react";

import Modal from "react-bootstrap/Modal";

import "./App.css";

const resetClicks = (cards) => {
  let clicked = {};
  cards.forEach((card) => {
    clicked[card.name] = false;
  });
  return clicked;
};

const nextLevelIndicator = (level) => {
  if (1 <= level <= 4) {
    return 2 * level * (level + 1);
  }

  throw new Error("Non-valid level: " + level);
};

const isWin = (level, currScore) => {
  return level === 4 && currScore === 2 * level * (level + 1);
};
const initalState = {
  cards: [],
  clicked: {},
  currScore: 0,
  bestScore: 0,
  level: { val: 1 },
};

const reducer = (prevState, action) => {
  let currScore = prevState.currScore,
    level = prevState.level,
    clicked = { ...prevState.clicked },
    bestScore = prevState.bestScore,
    cards = prevState.cards;

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
        if (level.val < 4) {
          level = { val: level.val + 1 };
        } else {
          // TODO handle pass all levels
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
    case "NEW_GAME":
      level = { val: 1 };
      currScore = 0;
      break;

    default:
      throw new Error("Unexpected action after dispatch");
  }
  return { cards, clicked, currScore, bestScore, level };
};

function App() {
  const [state, dispatch] = useReducer(reducer, initalState);
  const [characterCount, setCharacterCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("https://rickandmortyapi.com/api/character")
      .then((response) => response.json())
      .then((allCharacters) => setCharacterCount(allCharacters.info.count))
      .catch(console.log("ERROR fetching number of character"));
  }, []);

  useEffect(() => {
    if (!characterCount) {
      return;
    }

    setIsLoading(true);
    const characterIds = uniqueNumbers(state.level.val * 4, characterCount);
    const cards = [];
    fetch(`https://rickandmortyapi.com/api/character/${characterIds.join(",")}`)
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
        setIsLoading(false);
      });
  }, [state.level, characterCount]);

  const cardClickHandler = (id) => {
    if (state.clicked[id]) {
      dispatch({ type: "MISS", id });
    } else {
      if (isWin(state.level.val, state.currScore)) {
      } else {
        dispatch({ type: "HIT", id });
      }
    }
  };

  return (
    <div className="container">
      <Header
        currScore={state.currScore}
        level={state.level.val}
        bestScore={state.bestScore}
      />
      {!isLoading && (
        <Cards
          cards={state.cards}
          level={state.level.val}
          onCardClick={cardClickHandler}
        />
      )}
      {isLoading && <div className="loader" />}
      <Footer />
    </div>
  );
}

export default App;
