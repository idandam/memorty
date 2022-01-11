import NewGameButton from "./NewGameButton";
import styles from "./Dialog.module.css";

const Dialog = (props) => {
  return (
    <div className={styles.dialog}>
      <header className={styles.header}>
        <p>{props.title}</p>
      </header>
      <div className={styles.body}>
        <p>{props.body}</p>
      </div>
      <footer className={styles.footer}>
        <NewGameButton onClick={props.onWin}>PLAY AGAIN</NewGameButton>
      </footer>
    </div>
  );
};
export default Dialog;
