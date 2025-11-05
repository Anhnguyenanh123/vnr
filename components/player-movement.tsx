"use client";

const PhaserLib = typeof window !== "undefined" ? require("phaser") : null;
type Phaser = typeof import("phaser");

export class PlayerMovement {
  private scene: Phaser.Scene;
  private player!: Phaser.Physics.Arcade.Sprite;
  private playerNameText!: Phaser.GameObjects.Text;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasd!: {
    W: Phaser.Input.Keyboard.Key;
    A: Phaser.Input.Keyboard.Key;
    S: Phaser.Input.Keyboard.Key;
    D: Phaser.Input.Keyboard.Key;
  };
  private username: string;
  private movementEnabled: boolean = true;

  constructor(scene: Phaser.Scene, username: string) {
    this.scene = scene;
    this.username = username;
  }

  createPlayer(x: number, y: number): Phaser.Physics.Arcade.Sprite {
    this.player = this.scene.physics.add.sprite(x, y, "player");
    
    this.player.setCollideWorldBounds(true);
    this.player.setScale(2);
    this.player.setDepth(10);

    this.player.anims.play("idle-down");

    this.playerNameText = this.scene.add
      .text(this.player.x, this.player.y + 45, this.username, {
        fontSize: "14px",
        color: "#ffffff",
        backgroundColor: "#000000",
        padding: { x: 6, y: 3 },
      })
      .setOrigin(0.5)
      .setDepth(100);

    this.setupControls();
    this.setupCamera();

    return this.player;
  }



  private setupControls() {
    this.cursors = this.scene.input.keyboard!.createCursorKeys();
    this.wasd = {
      W: this.scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.W),
      A: this.scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      S: this.scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.S),
      D: this.scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.D),
    };
  }

  private setupCamera() {
    this.scene.cameras.main.startFollow(this.player, true, 0.1, 0.1);
  }

  update() {
    if (!this.player) return;

    let lastDirection = "down";
    if (this.player.anims.currentAnim) {
      const animKey = this.player.anims.currentAnim.key;
      if (animKey.includes("up")) lastDirection = "up";
      else if (animKey.includes("down")) lastDirection = "down";
      else if (animKey.includes("left")) lastDirection = "left";
      else if (animKey.includes("right")) lastDirection = "right";
    }

    this.player.setVelocity(0);

    if (!this.movementEnabled) {
      this.player.anims.play(`idle-${lastDirection}`, true);
      this.playerNameText.setPosition(this.player.x, this.player.y + 45);
      return;
    }

    const speed = 250;
    let isMoving = false;

    if (this.cursors.left.isDown || this.wasd.A.isDown) {
      this.player.setVelocityX(-speed);
      this.player.anims.play("walk-left", true);
      isMoving = true;
    } else if (this.cursors.right.isDown || this.wasd.D.isDown) {
      this.player.setVelocityX(speed);
      this.player.anims.play("walk-right", true);
      isMoving = true;
    }

    if (this.cursors.up.isDown || this.wasd.W.isDown) {
      this.player.setVelocityY(-speed);
      if (!isMoving) {
        this.player.anims.play("walk-up", true);
      }
      isMoving = true;
    } else if (this.cursors.down.isDown || this.wasd.S.isDown) {
      this.player.setVelocityY(speed);
      if (!isMoving) {
        this.player.anims.play("walk-down", true);
      }
      isMoving = true;
    }

    if (!isMoving) {
      this.player.anims.play(`idle-${lastDirection}`, true);
    }

    this.playerNameText.setPosition(this.player.x, this.player.y + 45);

    (window as any).playerPositionRef.current = {
      x: this.player.x,
      y: this.player.y,
    };

    window.dispatchEvent(
      new CustomEvent("playerMove", {
        detail: { x: this.player.x, y: this.player.y },
      })
    );
  }

  getPlayer(): Phaser.Physics.Arcade.Sprite {
    return this.player;
  }

  getPlayerNameText(): Phaser.GameObjects.Text {
    return this.playerNameText;
  }

  teleportTo(x: number, y: number) {
    this.player.setPosition(x, y);
    this.playerNameText.setPosition(x, y + 45);
    (window as any).playerPositionRef.current = { x, y };
  }

  setMovementEnabled(enabled: boolean) {
    this.movementEnabled = enabled;
  }
}