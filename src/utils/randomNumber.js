const randomNumber = (start, range, exclude) => {
  let res;
  do {
    res = Math.floor(Math.random() * range) + start;
  } while (exclude && res === exclude);
  return res;
};

export default randomNumber;
