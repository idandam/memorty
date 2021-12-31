import NewGameButton from "./NewGameButton";
import styles from "./Dialog.module.css";

const Dialog = (props) => {
  return (
    <div className={styles.dialog}>
      <header className={styles.header}>{props.title}</header>
      <p className={styles.body}>{props.body}</p>
      <footer className={styles.footer}>
        <NewGameButton onClick={props.onNewGame}>PLAY AGAIN</NewGameButton>
      </footer>
    </div>
  );
};
export default Dialog;
