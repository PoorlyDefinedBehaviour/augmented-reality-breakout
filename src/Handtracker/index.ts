import * as HandTrack from "handtrackjs";

export type ModelParams = {
  outputStride: number;
  imageScaleFactor: number;
  flipHorizontal: boolean; // flip e.g for video
  maxNumBoxes: number; // maximum number of boxes to detect
  iouThreshold: number; // ioU threshold for non-max suppression
  scoreThreshold: number; // confidence threshold for predictions.
};

export interface Prediction {
  bbox: Array<number>;
  class: string | number;
  score: number;
}

export type OnPredictionFn = (predictions: Array<Prediction>) => void;

export class HandTracker {
  private model: any;
  private video: any;
  private canvas: any;
  private canvas_context: any;

  public start = async (model_params: ModelParams): Promise<void> => {
    this.video = document.getElementById("video");
    this.canvas = document.getElementById("video-canvas") as any;
    this.canvas_context = this.canvas.getContext("2d");

    this.model = await HandTrack.load(model_params);

    await HandTrack.startVideo(this.video);

    (document.getElementById("loading") as any).style.display = "none";
  };

  public predict = async (on_prediction: OnPredictionFn): Promise<void> => {
    const predictions = await this.model.detect(this.video);

    this.model.renderPredictions(
      predictions,
      this.canvas,
      this.canvas_context,
      this.video
    );

    on_prediction(predictions);

    requestAnimationFrame((): Promise<void> => this.predict(on_prediction));
  };
}
