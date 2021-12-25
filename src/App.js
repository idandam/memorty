import "./components/Cards/Card";
import "./App.css";
import Cards from "./components/Cards/Cards";
import Card from "./components/Cards/Card";
import Progress from "./components/Progress/Progress";

const cards = [
  { url: "129.jpeg", name: 0 },
  { url: "129.jpeg", name: 1 },
  { url: "129.jpeg", name: 2 },
  { url: "129.jpeg", name: 3 },
];

function App() {
  return (
    <>
      <Progress />
      <Cards>
        {cards.map((card) => (
          <Card key={card.name} name={card.name} url={card.url} />
        ))}
      </Cards>
    </>
  );
}

export default App;
