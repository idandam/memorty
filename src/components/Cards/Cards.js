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
  return (
    <div onClick={clickHandler} className={styles.grid}>
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
