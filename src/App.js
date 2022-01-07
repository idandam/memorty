import Cards from "./components/Cards/Cards";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import Dialog from "./components/UI/Dialog";

import useHttp from "./hooks/useHttp";

import isWin from "./utils/isWin";

import "./App.css";
import Error from "./components/UI/Error";

function App() {
  const { error, state, loading, dispatch } = useHttp();

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

  const downgradeLevel = () => {
    dispatch({ type: "DOWNGRADE_LEVEL" });
  };

  return (
    <>
      {!error && (
        <div className="container">
          <Header
            currScore={state.currScore}
            level={state.level.val}
            bestScore={state.bestScore}
            isLose={state.isLose}
            onMiss={downgradeLevel}
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
              title="Great job!"
              body={<>I hoped you enjoyed the game</>}
              actionText="PLAY AGAIN"
              onWin={downgradeLevel}
            />
          )}
          <Footer />
        </div>
      )}
      {error && <Error />}
    </>
  );
}

export default App;
