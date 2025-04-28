// Check if a number is prime
function isPrime(n: number) {
  if (n < 2) return false;
  for (let i = 2; i <= Math.sqrt(n); i++) {
    if (n % i === 0) return false;
  }
  return true;
}

// Find the nth prime number
self.onmessage = function (e) {
  const target = e.data;
  let count = 0;
  let num = 1;
  const reportEvery = Math.floor(target / 100);

  while (count < target) {
    num++;
    if (isPrime(num)) {
      count++;

      if (count % reportEvery === 0) {
        self.postMessage({
          type: "progress",
          percent: Math.floor((count / target) * 100),
        });
      }
    }
  }
  self.postMessage({ type: "result", value: num, input: target });
};
