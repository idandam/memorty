import ProgressElement from "./ProgressElement";

import styles from "./Progress.module.css";

const Progress = (props) => {
  return (
    <div className={styles.progress}>
      <ProgressElement name="Current Score" value={1} />
      <ProgressElement name="Level" value={2} />
      <ProgressElement name="Best Score" value={4} />
    </div>
  );
};

export default Progress;
