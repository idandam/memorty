import { LEVELS } from "../constants/constants";

const nextLevelIndicator = (level) => {
  if (1 <= level && level <= LEVELS) {
    return 2 * level * (level + 1);
    // } else if (level === LEVELS - 1) {
    //   return 2 * level * (level + 1) - 2;
    // } else if (level === LEVELS) {
    //   return 2 * level * (level + 1) + LEVELS;
  }

  throw new Error("Non-valid level: " + level);
};

export default nextLevelIndicator;
