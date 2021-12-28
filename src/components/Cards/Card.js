import styles from "./Card.module.css";

import img129 from "../../img/129.jpeg";

const Card = (props) => {
  return (
    <figure id={props.id} className={styles["card-box"]}>
      <img
        className={styles["card-image"]}
        src={img129}
        // className={styles["card-image"]}
        alt="Rick and Morty character"
      ></img>
      <figcaption className={styles["card-name"]}>{props.name}</figcaption>
      <button className={styles["card-btn"]}>DETAILS</button>
    </figure>
  );
};

export default Card;
