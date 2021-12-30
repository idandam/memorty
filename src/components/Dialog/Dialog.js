import styles from "./Dialog.module.css";

const Win = (props) => {
  return (
    <div className={styles.dialog}>
      <header className={styles.header}>{props.title}</header>
      <p className={styles.body}>{props.body}</p>
      <footer className={styles.footer}>
        <button onClick={props.onNewGame} className={styles.btn}>
          {props.actionText}
        </button>
      </footer>
    </div>
  );
};
export default Win;
