import "./components/Cards/Card";
import "./App.css";
import Cards from "./components/Cards/Cards";
import Progress from "./components/Progress/Progress";
import { useReducer } from "react";

const cards = [
  { url: "129.jpeg", name: 0 },
  { url: "129.jpeg", name: 1 },
  { url: "129.jpeg", name: 2 },
  { url: "129.jpeg", name: 3 },
];

const clicked = {};
cards.forEach((card) => {
  clicked[card.name] = false;
});

const initalState = { clicked, currScore: 0, bestScore: 0, level: 1 };

const reducer = (prevState, action) => {
  let currScore = 0,
    level = 1,
    clicked = prevState.clicked,
    bestScore = prevState.bestScore;

  switch (action.type) {
    case "CARD_CLICK": {
      // handle hit
      if (!prevState.clicked[action.id]) {
        currScore = prevState.currScore + 1;
        if (currScore === cards.length) {
          level = prevState.level + 1;
        }
        if (currScore > prevState.bestScore) {
          bestScore = currScore;
        }
        clicked = { ...clicked };
        clicked[action.id] = true;
        // handle miss
      } else if (prevState.level > 0) {
        level = prevState.level - 1;
        // remove some photos
      }
      return { clicked, currScore, bestScore, level };
    }
    default:
      throw new Error("Unexpected action after dispatch");
  }
};

function App() {
  const [state, dispatch] = useReducer(reducer, initalState);

  const cardClickHandler = (id) => {
    dispatch({ type: "CARD_CLICK", id });
  };

  return (
    <>
      <Progress
        currScore={state.currScore}
        level={state.level}
        bestScore={state.bestScore}
      />
      <Cards cards={cards} onCardClick={cardClickHandler} />
    </>
  );
}

export default App;
