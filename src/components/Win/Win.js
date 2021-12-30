import styles from "./Win.module.css";

const Win = (props) => {
  return (
    <div className={styles.dialog}>
      <header className={styles.header}>Win!</header>
      <p className={styles.body}>
        Great job!.
        <br /> You've finished all the levels.
      </p>
      <footer className={styles.footer}>
        <button onClick={props.onNewGame} className={styles.btn}>
          PLAY AGAIN
        </button>
      </footer>
    </div>
  );
};
export default Win;
