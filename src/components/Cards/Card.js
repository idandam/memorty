import styles from "./Card.module.css";

const Card = (props) => {
  return (
    <figure id={props.id} className={styles["card-box"]}>
      <img
        className={styles["card-image"]}
        src={props.src}
        // className={styles["card-image"]}
        alt={props.name}
      ></img>
      <figcaption className={styles["card-name"]}>{props.name}</figcaption>
      <button className={styles["card-btn"]}>DETAILS</button>
    </figure>
  );
};

export default Card;
