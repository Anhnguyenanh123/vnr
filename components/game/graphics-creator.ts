export class GraphicsCreator {
  static createInfoPointGraphic(scene: Phaser.Scene) {
    const graphics = scene.make.graphics({ x: 0, y: 0 });

    graphics.fillStyle(0x3b82f6, 1);
    graphics.fillCircle(40, 40, 35);

    graphics.fillStyle(0xffffff, 1);
    graphics.fillCircle(40, 25, 5);
    graphics.fillRect(35, 35, 10, 25);

    graphics.generateTexture("info-point", 80, 80);
    graphics.destroy();
  }

  static createQuizPointGraphic(scene: Phaser.Scene) {
    const graphics = scene.make.graphics({ x: 0, y: 0 });
    graphics.fillStyle(0xf59e0b, 1);
    graphics.fillCircle(40, 40, 35);

    graphics.fillStyle(0xffffff, 1);
    graphics.fillTriangle(40, 15, 30, 35, 50, 35);
    graphics.fillTriangle(40, 65, 30, 45, 50, 45);

    graphics.generateTexture("quiz-point", 80, 80);
    graphics.destroy();
  }
}