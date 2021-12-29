const uniqueNumbers = (size, rangeUpperBound) => {
  const data = [];
  while (data.length < size) {
    let n = Math.floor(Math.random() * rangeUpperBound);
    if (data.indexOf(n) === -1) {
      data.push(n);
    }
  }
  return data;
};
export default uniqueNumbers;
