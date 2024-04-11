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

type CallbackFunction = (event: any) => void;

// Function to debounce the event listener
function debounce(callback: CallbackFunction, delay: number): CallbackFunction {
  let timerId: NodeJS.Timeout;

  return function (...args: any[]) {
    clearTimeout(timerId);
    timerId = setTimeout(() => {
      // @ts-ignore
      callback.apply(this, args);
    }, delay);
  };
}

export {calculateAverage, debounce};
