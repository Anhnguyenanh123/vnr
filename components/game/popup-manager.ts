export class PopupManager {
  private scene: Phaser.Scene;
  private currentPopup: {
    overlay?: Phaser.GameObjects.Rectangle;
    bg?: Phaser.GameObjects.Rectangle;
    text?: Phaser.GameObjects.Text;
    button?: Phaser.GameObjects.Rectangle;
    buttonText?: Phaser.GameObjects.Text;
    titleText?: Phaser.GameObjects.Text;
  } | null = null;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  showGamePopup(title: string, message: string, buttonText: string = "OK", onClose?: () => void) {
    if (this.currentPopup) {
      this.closeCurrentPopup();
    }

    const centerX = this.scene.sys.game.config.width as number / 2;
    const centerY = this.scene.sys.game.config.height as number / 2;

    const overlay = this.scene.add.rectangle(centerX, centerY, 5000, 3000, 0x000000, 0.9);
    overlay.setDepth(10000).setScrollFactor(0);

    const bg = this.scene.add.rectangle(centerX, centerY, 450, 250, 0x1a1a2e);
    bg.setDepth(10001).setScrollFactor(0);

    const titleText = this.scene.add.text(centerX, centerY - 60, title, {
      fontSize: "24px",
      color: "#e8e8e8",
      fontStyle: "bold",
    }).setOrigin(0.5).setDepth(10002).setScrollFactor(0);

    const messageText = this.scene.add.text(centerX, centerY - 10, message, {
      fontSize: "16px",
      color: "#e8e8e8",
      align: "center",
      wordWrap: { width: 400 }
    }).setOrigin(0.5).setDepth(10002).setScrollFactor(0);

    const button = this.scene.add.rectangle(centerX, centerY + 60, 150, 40, 0x0f3460);
    button.setDepth(10002).setScrollFactor(0);
    button.setInteractive();

    const btnText = this.scene.add.text(centerX, centerY + 60, buttonText, {
      fontSize: "14px",
      color: "#e8e8e8",
      fontStyle: "bold",
    }).setOrigin(0.5).setDepth(10003).setScrollFactor(0);

    this.currentPopup = {
      overlay,
      bg,
      text: messageText,
      button,
      buttonText: btnText,
      titleText: titleText
    };

    const closePopup = () => {
      this.closeCurrentPopup();
      if (onClose) onClose();
    };

    button.on("pointerdown", closePopup);

    button.on("pointerover", () => {
      button.setFillStyle(0x1e3a5f);
    });

    button.on("pointerout", () => {
      button.setFillStyle(0x0f3460);
    });
  }

  closeCurrentPopup() {
    if (this.currentPopup) {
      this.currentPopup.overlay?.destroy();
      this.currentPopup.bg?.destroy();
      this.currentPopup.text?.destroy();
      this.currentPopup.button?.destroy();
      this.currentPopup.buttonText?.destroy();
      this.currentPopup.titleText?.destroy();
      this.currentPopup = null;
    }
  }

  showFinalCompletionPopup() {
    this.showGamePopup(
      "🏆 HOÀN THÀNH! 🏆",
      "Chúc mừng bạn đã hoàn thành trò chơi!\nBạn sẽ được ghi nhận thành tích.",
      "KẾT THÚC",
      () => {
        window.dispatchEvent(new Event("quizCompleted"));
      }
    );
  }
}