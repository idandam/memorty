import ProgressElement from "./ProgressElement";

import styles from "./Progress.module.css";

const Progress = (props) => {
  return (
    <div className={styles.progress}>
      <ProgressElement name="Current Score" value={props.currScore} />
      <ProgressElement name="Level" value={props.level} />
      <ProgressElement name="Best Score" value={props.bestScore} />
    </div>
  );
};

export default Progress;
