//generate a random 11-digit number
exports.generateNumber = () => {
  const min = 10000000000;
  const max = 99999999999;
  return String(Math.floor(Math.random() * (max - min + 1)) + min);
};
