import Card from "./Card";

import styles from "./Cards.module.css";

const Cards = (props) => {
  const clickHandler = (event) => {
    const figure = event.target.closest("figure");
    if (figure) {
      if (event.target.tagName === "BUTTON") {
        //handle
      } else {
        props.onCardClick(figure.id);
      }
    }
  };

  let gridCol = styles["grid__4-col"];

  if (props.level === 2) {
    gridCol = styles["grid__8-col"];
  } else if (props.level === 3) {
    gridCol = styles["grid__6-col"];
  }

  return (
    <div onClick={clickHandler} className={`${styles.grid} ${gridCol}`}>
      {props.cards.map((card) => (
        <Card
          key={card.name}
          id={card.name}
          name={card.name}
          url={card.url}
          onCardClick={props.onCardClick}
        />
      ))}
    </div>
  );
};

export default Cards;
