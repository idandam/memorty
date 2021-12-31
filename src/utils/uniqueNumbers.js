const uniqueNumbers = (size, rangeUpperBound) => {
  const data = [];
  /*
   If we can't chose elements in {0,1,...,size-1} 
   from element in {0,1,...rangeUpperBound - 1} 
   then data = {0,1,...rangeUpperBound - 1}
  */
  if (size >= rangeUpperBound) {
    for (let i = 0; i < rangeUpperBound; i++) {
      data.push(i);
    }
  } else {
    while (data.length < size) {
      let n = Math.floor(Math.random() * rangeUpperBound);
      if (data.indexOf(n) === -1) {
        data.push(n);
      }
    }
  }
  return data;
};

export default uniqueNumbers;
