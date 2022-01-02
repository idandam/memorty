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

  return { state, loading, dispatch };
};

export default useHttp;
