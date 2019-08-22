import { Vec2 } from "../Vec2/Index";

interface Entity {
  position: Vec2;
  width: number;
  height: number;
  active: boolean;
}

export class Game {
  private canvas: HTMLCanvasElement = document.getElementById("canvas") as any;
  private canvas_context: any = this.canvas.getContext("2d");

  private player: Entity = {
    position: {
      x: 0,
      y: 0
    },
    width: 0,
    height: 0,
    active: true
  };

  private ball: Entity | any = {
    position: {
      x: 0,
      y: 0
    },
    width: 30,
    height: 30,
    active: true,
    x_speed: 3,
    y_speed: 3
  };

  private targets: Array<Entity> = [];

  constructor() {
    this.recalculate();

    window.addEventListener("resize", this.recalculate);
  }

  private recalculate = (): void => {
    this.canvas.width = window.innerWidth / 2;
    this.canvas.height = window.innerHeight;

    this.player.width = 0.2 * window.innerWidth;
    this.player.height = 0.05 * window.innerHeight;

    const video = document.getElementById("video") as any;
    video.width = this.canvas.width;
    video.height = this.canvas.height;

    this.player.position.x = this.canvas.width / 2 - this.player.width / 2;
    this.player.position.y = this.canvas.height - 100;

    this.ball.position.x = this.canvas.width / 2;

    this.ball.position.y = this.player.position.y - this.ball.height - 40;

    this.generate_targets();
  };

  private generate_targets = (): void => {
    const width: number = 30;
    const height: number = 30;

    for (let j = 0; j < 3; ++j) {
      let pos: number = 20;

      while (pos < this.canvas.width - width - 20) {
        const target: Entity = {
          position: {
            x: pos,
            y: j * height + j * 10 + 20
          },
          width,
          height,
          active: true
        };

        this.targets.push(target);

        pos += width + 10;
      }
    }
  };

  private is_colliding = (a: Entity, b: Entity): boolean =>
    a.position.x + a.width >= b.position.x &&
    a.position.x <= b.position.x + b.width &&
    a.position.y + a.height >= b.position.y &&
    a.position.y <= b.position.y + b.height;

  private deactivate_targets_on_collision = (): void => {
    for (let target of this.targets) {
      if (!target.active) {
        continue;
      }

      if (this.is_colliding(target, this.ball)) {
        this.randomly_change_ball_direction();
        target.active = false;
      }
    }
  };

  private randomly_change_ball_direction = (): void => {
    Math.random() < 0.5 ? (this.ball.x_speed *= -1) : (this.ball.y_speed *= -1);
  };

  private keep_ball_on_screen = (): void => {
    if (
      this.ball.position.x <= 0 ||
      this.ball.position.x >= this.canvas.width
    ) {
      this.ball.x_speed *= -1;
    }

    if (this.ball.position.y <= 0) {
      this.ball.y_speed *= -1;
    }
  };

  private check_if_game_over = (): void => {
    if (this.ball.position.y > this.canvas.height) {
      this.recalculate();
    }
  };

  private is_colliding_with_player = (): void => {
    if (this.is_colliding(this.ball, this.player)) {
      this.ball.y_speed = -3;
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

    this.ball.position.x += this.ball.x_speed;
    this.ball.position.y += this.ball.y_speed;

    this.keep_ball_on_screen();
    this.deactivate_targets_on_collision();
    this.is_colliding_with_player();
    this.check_if_game_over();

    this.canvas_context.fillStyle = "#2980b9";
    for (const target of this.targets) {
      if (target.active) {
        this.canvas_context.fillRect(
          target.position.x,
          target.position.y,
          target.width,
          target.height
        );
      }
    }

    this.canvas_context.fillStyle = "#e67e22";
    this.canvas_context.fillRect(
      this.ball.position.x,
      this.ball.position.y,
      this.ball.width,
      this.ball.height
    );

    this.canvas_context.fillStyle = "#341f97";
    this.canvas_context.fillRect(
      this.player.position.x,
      this.player.position.y,
      this.player.width,
      this.player.height
    );

    requestAnimationFrame(this.draw);
  };
}
