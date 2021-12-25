import testImage from "../../img/129.jpeg";
import styles from "./Card.module.css";

const Card = (props) => {
  return (
    <figure className={styles["card-container"]}>
      <img
        src={testImage}
        className={styles["card-image"]}
        alt="Rick and Morty character"
      ></img>
      <p className={styles["card-name"]}>{props.name}</p>
      <button className={styles["card-btn"]}>DETAILS</button>
    </figure>
  );
};

export default Card;
