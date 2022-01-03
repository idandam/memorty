import { useReducer } from "react";
import { useState } from "react";
import { useEffect } from "react";
import store from "../store/store";
import buildURL from "../API/buildURL";
import httpReq from "../API/httpReq";
import { getCards } from "../API/cardsRequests";

const useHttp = () => {
  const [state, dispatch] = useReducer(store.reducer, store.initialState);
  const [characterCount, setCharacterCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (loading) {
      let tid = setTimeout(() => {
        setError(true);
      }, 1000);

      return () => {
        clearTimeout(tid);
      };
    }
  }, [loading]);

  useEffect(() => {
    httpReq(buildURL())
      .then((characterCount) => {
        setCharacterCount(characterCount);
      })
      .catch(() => {
        setError(true);
      });
  }, []);

  useEffect(() => {
    if (!characterCount) {
      return;
    }

    setLoading(true);

    getCards(state.level, characterCount)
      .then((cards) => {
        dispatch({ type: "NEW_CARDS", cards });
        setLoading(false);
      })
      .catch(() => {
        setError(true);
      });
  }, [state.level, characterCount]);

  return { error, state, loading, dispatch };
};

export default useHttp;
