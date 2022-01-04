import Card from "./Card";

import styles from "./Cards.module.css";

import { LEVELS } from "../../constants/constants";

const Cards = (props) => {
  const clickHandler = (event) => {
    const figure = event.target.closest("figure");
    if (figure) {
      if (event.target.tagName === "BUTTON") {
        //TODO implement
      } else if (props.onCardClick) {
        props.onCardClick(figure.id);
      }
    }
  };
  return (
    <div
      onClick={clickHandler}
      className={`${styles.grid} ${
        props.level === LEVELS ? styles["last-level"] : ""
      } ${!props.notClicked ? styles.animate : ""}`}
    >
      {props.cards.map((card) => (
        <Card
          key={card.id}
          id={card.id}
          name={card.name}
          src={card.image}
          isClicked={
            props.notClicked && props.notClicked.includes(card.id + "")
          }
          defaultCursor={props.notClicked}
        />
      ))}
    </div>
  );
};

export default Cards;
