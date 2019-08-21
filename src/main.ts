import "@babel/polyfill";

//const tracker: Worker = new Worker("./worker");
import TrackerWorker = require("worker-loader?name=dist/[name].js!./worker");

import { Game } from "./Game/Index";

async function main(): Promise<void> {
  const game = new Game();

  const tracker = new TrackerWorker();

  tracker.onmessage = ({ data: predictions }: MessageEvent) => {
    /* if (predictions && predictions.length > 0) {
      const { bbox } = predictions[0];

      game.move_player(bbox[0] + bbox[2] / 2);
    } */

    console.log("event", JSON.stringify(predictions, null, 2));
  };

  game.draw();
}
main();
