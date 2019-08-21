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

  public start = async (model_params: IModelParams): Promise<void> => {
    this.video = document.getElementById("video");

    this.model = await HandTrack.load(model_params);

    await HandTrack.startVideo(this.video);
  };

  public predict = async (on_prediction: OnPredictionFn): Promise<void> => {
    const predictions = await this.model.detect(this.video);

    /* const canvas = document.getElementById("canvas");

    this.model.renderPredictions(
      predictions,
      canvas,
      (canvas as any).getContext("2d"),
      this.video
    ); */

    on_prediction(predictions);

    requestAnimationFrame((): Promise<void> => this.predict(on_prediction));
  };
}
