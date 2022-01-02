import Cards from "./components/Cards/Cards";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import Dialog from "./components/UI/Dialog";

import useHttp from "./hooks/useHttp";

import nextLevelIndicator from "./utils/nextLevelIndicator";

import { LEVELS } from "./constants/constants";

import "./App.css";

const isWin = (level, currScore) => {
  return level === LEVELS && currScore === nextLevelIndicator(level) - 1;
};

function App() {
  const { state, loading, dispatch } = useHttp();

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
