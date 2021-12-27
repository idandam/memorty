import "./components/Cards/Card";
import "./App.css";
import Cards from "./components/Cards/Cards";
import Progress from "./components/Progress/Progress";
import { useReducer } from "react";
import { useEffect } from "react";

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

const resetClicks = (clicked) => {
  dataSource.forEach((card) => {
    clicked[card.name] = false;
  });
};
const clicked = {};
resetClicks(clicked);

// Fisher-Yates shuffle
const shuffle = (elments) => {
  for (let i = elments.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [elments[i], elments[j]] = [elments[j], elments[i]];
  }
};

const getBound = (level) => {
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
  clicked,
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
      return { cards: action.data, clicked, currScore, bestScore, level };
    case "CARD_CLICK": {
      // handle hit
      if (!prevState.clicked[action.id]) {
        clicked[action.id] = true;
        currScore = currScore + 1;
        //TODO change this
        if (currScore === getBound(level.val)) {
          if (level.val < 3) {
            resetClicks(clicked);
            level = { val: level.val + 1 };
            // add cards
            // let numOfCards = cards.length;
            // for (let i = 0; i < 4; i++) {
            //   cards.push(dataSource[i + numOfCards]);
            // }
          } else {
            // TODO handle pass all levels
          }
        } else {
          shuffle(cards);
        }
        if (currScore > bestScore) {
          bestScore = currScore;
        }
        // handle miss
      } else {
        resetClicks(clicked);
        // start new
        // shuffle(cards);
        level = { val: 1 };
        currScore = 0;
      }
      return { cards, clicked, currScore, bestScore, level };
    }
    default:
      throw new Error("Unexpected action after dispatch");
  }
};

function App() {
  const [state, dispatch] = useReducer(reducer, initalState);

  useEffect(() => {
    let data = fetch();
    data = data.slice(0, state.level.val * 4);
    dispatch({ type: "NEW_CARDS", data });
  }, [state.level]);

  const cardClickHandler = (id) => {
    dispatch({ type: "CARD_CLICK", id });
  };

  return (
    <>
      <Progress
        currScore={state.currScore}
        level={state.level.val}
        bestScore={state.bestScore}
      />
      <Cards cards={state.cards} onCardClick={cardClickHandler} />
    </>
  );
}

export default App;
