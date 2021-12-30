import Card from "./Card";

import styles from "./Cards.module.css";

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
      className={`${styles.grid} ${!props.clicked ? styles.animate : ""}`}
    >
      {props.cards.map((card) => (
        <Card
          key={card.id}
          id={card.id}
          name={card.name}
          src={card.image}
          miss={props.clicked && props.clicked.includes(card.id + "")}
          defaultCursor={!!props.clicked}
        />
      ))}
    </div>
  );
};

export default Cards;
