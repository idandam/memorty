import { LEVELS } from "../constants/constants";
import levelMaxScore from "./levelMaxScore";

const isWin = (level, currScore) => {
  return level === LEVELS && currScore === levelMaxScore(level) - 1;
};

export default isWin;
