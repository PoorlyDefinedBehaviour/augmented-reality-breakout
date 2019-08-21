const tracker: Worker = self as any;

import * as HandTrack from "handtrackjs";

export type IModelParams = {
  outputStride: number;
  imageScaleFactor: number;
  flipHorizontal: boolean; // flip e.g for video
  maxNumBoxes: number; // maximum number of boxes to detect
  iouThreshold: number; // ioU threshold for non-max suppression
  scoreThreshold: number; // confidence threshold for predictions.
};

export interface IPrediction {
  bbox: Array<number>;
  class: string | number;
  score: number;
}

export type OnPredictionFn = (predictions: Array<IPrediction>) => void;

export class HandTracker {
  private model: any;
  private video: any;

  private model_params: IModelParams = {
    outputStride: 8,
    imageScaleFactor: 0.7,
    flipHorizontal: true,
    maxNumBoxes: 1,
    iouThreshold: 1,
    scoreThreshold: 0.99
  };

  public start = async (): Promise<void> => {
    this.video = document.getElementById("video");

    this.model = await HandTrack.load(this.model_params);

    await HandTrack.startVideo(this.video);
  };

  public predict = async (): Promise<void> => {
    const predictions = await this.model.detect(this.video);

    /* const canvas = document.getElementById("canvas");

    this.model.renderPredictions(
      predictions,
      canvas,
      (canvas as any).getContext("2d"),
      this.video
    ); */

    //on_prediction(predictions);

    tracker.postMessage(predictions);
    requestAnimationFrame(this.predict);
  };
}

new HandTracker().start();
