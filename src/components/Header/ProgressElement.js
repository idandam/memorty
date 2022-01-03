import styles from "./ProgressElement.module.css";

const ProgressElement = (props) => {
  return (
    <div className={styles.container}>
      <p className={styles.name}>{props.name}</p>
      <p
        className={`${styles.value} ${
          props.name === "Level" ? styles["p__level"] : ""
        }`}
      >
        {props.value}
        {props.name === "Level" && (
          <>
            <span className={styles.vert}></span>
            <span className={styles["max-level"]}>5</span>
          </>
        )}
      </p>
    </div>
  );
};

export default ProgressElement;
