import { LEVELS } from "../../constants/constants";
import styles from "./Card.module.css";

const Card = (props) => {
  return (
    <figure
      id={props.id}
      className={`${styles["card-box"]} ${
        props.isClicked ? styles.border : ""
      } ${props.defaultCursor ? styles["default-cursor"] : ""} ${
        props.level === LEVELS ? styles["card-box__level-6"] : ""
      }`}
    >
      <img
        className={styles["card-image"]}
        src={props.src}
        alt={props.name}
      ></img>
      <figcaption className={styles["card-name"]}>{props.name}</figcaption>
    </figure>
  );
};

export default Card;
