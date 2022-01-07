import Progress from "./Progress";
import styles from "./Header.module.css";
import logo from "../../img/logo.png";
import NewGameButton from "../UI/NewGameButton";

const Header = (props) => {
  return (
    <header className={styles.header}>
      <div className={styles["logo-box"]}>
        <img src={logo} alt="logo" className={styles.logo} />
        <p className={styles["logo-text"]}>Memorty</p>
      </div>
      {props.isLose && (
        <NewGameButton onClick={props.onMiss} isAbsolute={true}>
          TRY AGAIN
        </NewGameButton>
      )}
      <Progress
        currScore={props.currScore}
        level={props.level}
        bestScore={props.bestScore}
      />
    </header>
  );
};

export default Header;
