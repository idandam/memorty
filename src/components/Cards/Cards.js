import Card from "./Card";

import styles from "./Cards.module.css";

const Cards = (props) => {
  return (
    <div className={styles["grid"]}>
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
