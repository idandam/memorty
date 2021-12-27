import styles from "./Card.module.css";

const Card = (props) => {
  return (
    <figure id={props.id} className={styles["card-container"]}>
      <img
        src="#"
        // className={styles["card-image"]}
        alt="Rick and Morty character"
      ></img>
      <figcaption className={styles["card-name"]}>{props.name}</figcaption>
      <button className={styles["card-btn"]}>DETAILS</button>
    </figure>
  );
};

export default Card;
