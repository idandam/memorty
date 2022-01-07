import {
  LEVELS,
  LEVEL_FIVE_MAX_SCORE,
  LEVEL_SIX_MAX_SCORE,
} from "../constants/constants";

const levelMaxScore = (level) => {
  if (1 <= level && level < LEVELS - 1) {
    return 2 * level * (level + 1);
  } else if (level === LEVELS - 1) {
    return LEVEL_FIVE_MAX_SCORE;
  } else if (level === LEVELS) {
    return LEVEL_SIX_MAX_SCORE;
  }

  throw new Error("Non-valid level: " + level);
};

export default levelMaxScore;
