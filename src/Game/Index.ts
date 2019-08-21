import { Vec2 } from "../Vec2/Index";

interface IEntity {
  position: Vec2;
  width: number;
  height: number;
}

export class Game {
  private canvas: HTMLCanvasElement = document.getElementById("canvas") as any;
  private canvas_context: any = this.canvas.getContext("2d");

  private player: IEntity = {
    position: {
      x: 0,
      y: 0
    },
    width: 0,
    height: 0
  };

  private targets: Array<IEntity> = [];

  constructor() {
    this.recalculate();

    this.generate_targets();

    window.addEventListener("resize", this.recalculate);
  }

  private recalculate = (): void => {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;

    this.player.width = 0.2 * window.innerWidth;
    this.player.height = 0.05 * window.innerHeight;

    const video = document.getElementById("video") as any;
    video.width = this.canvas.width;
    video.height = this.canvas.height;

    this.player.position.x = this.canvas.width / 2 - this.player.width / 2;
    this.player.position.y = this.canvas.height - 100;
  };

  private generate_targets = (): void => {
    const width: number = this.canvas.width / 20 - 40;
    const height: number = 30;

    for (let j = 0; j < 3; ++j) {
      let pos: number = 20;

      while (pos < this.canvas.width - width - 20) {
        this.targets.push({
          position: {
            x: pos,
            y: j * height + j * 10 + 20
          },
          width,
          height
        });

        pos += width + 10;
      }
    }
  };

  public move_player = (x: number): void => {
    if (x >= 0 && x + this.player.width <= this.canvas.width) {
      this.player.position.x = x;
    }
  };

  public draw = (): void => {
    this.canvas_context.fillStyle = "rgba(34, 34, 34, 0.5)";
    this.canvas_context.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.canvas_context.fillStyle = "#e67e22";

    for (const target of this.targets) {
      this.canvas_context.fillRect(
        target.position.x,
        target.position.y,
        target.width,
        target.height
      );
    }

    this.canvas_context.fillStyle = "#2980b9";

    this.canvas_context.fillRect(
      this.player.position.x,
      this.player.position.y,
      this.player.width,
      this.player.height
    );
    requestAnimationFrame(this.draw);
  };
}
