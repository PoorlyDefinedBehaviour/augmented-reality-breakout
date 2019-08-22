import "@babel/polyfill";

import { Game } from "./Game/Index";

import { HandTracker, IPrediction } from "./Handtracker";

async function main(): Promise<void> {
  const game = new Game();

  const tracker = new HandTracker();

  await tracker.start({
    outputStride: 8,
    imageScaleFactor: 0.7,
    flipHorizontal: false,
    maxNumBoxes: 1,
    iouThreshold: 1,
    scoreThreshold: 0.99
  });

  tracker.predict((predictions: Array<IPrediction>) => {
    if (predictions && predictions.length > 0) {
      const { bbox } = predictions[0];

      game.move_player(bbox[0] + bbox[2] / 2);
    }
  });

  game.draw();
}
main();
