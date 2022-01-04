import shuffle from "../utils/shuffle";
import { LEVELS } from "../constants/constants";
import nextLevelIndicator from "../utils/nextLevelIndicator";

const resetClicks = (cards) => {
  let clicked = {};
  cards.forEach((card) => {
    clicked[card.id] = false;
  });
  return clicked;
};
const initialState = {
  cards: [],
  clicked: {},
  currScore: 0,
  bestScore: 0,
  level: { val: 1 },
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

const store = { reducer, initialState };

export default store;
