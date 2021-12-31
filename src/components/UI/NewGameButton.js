import styles from "./NewGameButton.module.css";

const NewGameButton = (props) => {
  return (
    <button
      onClick={props.onClick}
      className={`${styles.btn} ${
        props.isAbsolute ? styles["btn__absolute"] : ""
      }`}
    >
      {props.children}
    </button>
  );
};
export default NewGameButton;
