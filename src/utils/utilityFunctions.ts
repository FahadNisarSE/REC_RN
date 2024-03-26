
function calculateAverage(arrayOfNumbers: number[]): number {
  const size = arrayOfNumbers.length;
  let sum = 0;

  for (let i = 0; i < size; i++) {
    sum += arrayOfNumbers[i];
  }

  const average = sum / size;
  
  const roundedAverage = Number(average.toFixed(2));

  return roundedAverage;
}

export {calculateAverage};
