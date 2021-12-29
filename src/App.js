import Cards from "./components/Cards/Cards";
import shuffle from "./utils/shuffle";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";

import { useReducer } from "react";
import { useEffect } from "react";
import "./App.css";

/*
const fetchStaticImg = () => {
  const idsArray = [];
for (let i = 0; i < 16; i++) {
  idsArray.push(i);
}
const idsString = idsArray.join(",");

fetch(`https://rickandmortyapi.com/api/character/${idsString}`)
  .then((res) => res.json())
  .then((characters) => {
    for (let character of characters) {
      let img = document.createElement("img");
      img.src = character.image;
      img.alt = "sometext";
      document.body.prepend(img);
    }
  });
}
*/

const dataSource = [];
for (let i = 0; i < 24; i++) {
  dataSource.push({ name: i + "" });
}

const fetch = () => {
  return dataSource;
};

const resetClicks = (cards) => {
  let clicked = {};
  cards.forEach((card) => {
    clicked[card.name] = false;
  });
  return clicked;
};

const nextLevelIndicator = (level) => {
  switch (level) {
    case 1:
      return 4;
    case 2:
      return 12;
    case 3:
      return 24;
    default:
      throw new Error("Non-valid level: " + level);
  }
};
const initalState = {
  cards: [dataSource[0], dataSource[1], dataSource[2], dataSource[3]],
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
    cards = [...prevState.cards];

  switch (action.type) {
    case "NEW_CARDS":
      shuffle(action.data);
      cards = action.data;
      clicked = resetClicks(action.data);
      break;

    case "HIT":
      if (!prevState.clicked[action.id]) clicked[action.id] = true;
      currScore = currScore + 1;
      // If should play in the next level
      if (currScore === nextLevelIndicator(level.val)) {
        // if didn't reach max level
        if (level.val < 3) {
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
      // start new
      // shuffle(cards);
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

  useEffect(() => {
    let data = fetch();
    data = data.slice(0, state.level.val * 4);
    dispatch({ type: "NEW_CARDS", data });
  }, [state.level]);

  const cardClickHandler = (id) => {
    if (state.clicked[id]) {
      dispatch({ type: "MISS", id });
    } else {
      dispatch({ type: "HIT", id });
    }
  };

  return (
    <>
      <Header
        currScore={state.currScore}
        level={state.level.val}
        bestScore={state.bestScore}
      />
      <Cards
        cards={state.cards}
        level={state.level.val}
        onCardClick={cardClickHandler}
      />
      <Footer />
    </>
  );
}

export default App;
