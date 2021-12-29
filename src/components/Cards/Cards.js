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

  // let gridCol;

  // switch (props.level) {
  //   case 1:
  //     gridCol = styles["grid__4-col"];
  //     break;
  //   case 3:
  //   case 2:
  //   case 4:
  //     gridCol = styles["grid__8-col"];
  //     break;
  //   default:
  //     throw new Error("Invalid level");
  // }

  return (
    <div onClick={clickHandler} className={`${styles.grid}`}>
      {props.cards.map((card) => (
        <Card
          key={card.id}
          id={card.id}
          name={card.name}
          src={card.image}
          onCardClick={props.onCardClick}
        />
      ))}
    </div>
  );
};

export default Cards;
