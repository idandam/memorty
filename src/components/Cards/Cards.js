import Card from "./Card";

import styles from "./Cards.module.css";

const Cards = (props) => {
  const clickHandler = (event) => {
    const figure = event.target.closest("figure");
    if (figure && props.onCardClick) {
      props.onCardClick(figure.id);
    }
  };
  return (
    <div
      onClick={clickHandler}
      className={`${styles.container} ${
        !props.notClicked ? styles.animate : ""
      }`}
    >
      {props.cards.map((card) => (
        <Card
          key={card.id}
          id={card.id}
          name={card.name}
          src={card.image}
          level={props.level}
          isNotClicked={
            props.notClicked && props.notClicked.includes(card.id + "")
          }
          isDefaultCursor={props.notClicked}
        />
      ))}
    </div>
  );
};

export default Cards;
