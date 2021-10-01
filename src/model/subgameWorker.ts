
onmessage = function(e: MessageEvent<number[]>) {
  console.log('Message received from main script');
  const workerResult = 'Result: ' + (e.data[0] * e.data[1]);
  console.log('Posting message back to main script');
  const game = {
    test: 5
  }
  postMessage(game);
}