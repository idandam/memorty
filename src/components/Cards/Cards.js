import styles from "./Cards.module.css";

const Cards = (props) => {
  return <div className={styles["grid"]}>{props.children}</div>;
};

export default Cards;
