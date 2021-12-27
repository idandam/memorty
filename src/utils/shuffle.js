//Fisher-Yates algorithm
const shuffle = (elments) => {
  for (let i = elments.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [elments[i], elments[j]] = [elments[j], elments[i]];
  }
};

export default shuffle;
