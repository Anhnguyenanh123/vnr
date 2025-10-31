"use client";

import { useEffect, useRef, useState } from "react";
const PhaserLib = typeof window !== "undefined" ? require("phaser") : null;
type Phaser = typeof import("phaser");
import type { ExhibitData } from "@/types/museum";
import { museumData } from "@/data/museum-data";
import PictureModal from "@/components/picture-modal";
import { PlayerMovement } from "@/components/player-movement";
import { MuseumMapDisplay } from "@/components/museum-map-display";
import { ChatBox } from "@/components/chat-box";

interface MuseumSceneProps {
  onExhibitInteract: (exhibit: ExhibitData) => void;
  onDoorInteract: (roomNumber: number) => void;
  visitedExhibits: Set<string>;
  unlockedRooms: Set<number>;
  username: string;
}

export default function MuseumScene({
  onExhibitInteract,
  onDoorInteract,
  visitedExhibits,
  unlockedRooms,
  username,
}: MuseumSceneProps) {
  const gameRef = useRef<HTMLDivElement>(null);
  const phaserGameRef = useRef<any>(null);
  const [pictureModalOpen, setPictureModalOpen] = useState(false);
  const [currentPicture, setCurrentPicture] = useState<string>("");
  const [currentCaption, setCurrentCaption] = useState<string>("");
  const playerPositionRef = useRef<{ x: number; y: number }>({
    x: 100,
    y: 480,
  });

  useEffect(() => {
    if (!gameRef.current || phaserGameRef.current || !PhaserLib) return;

    const Phaser = PhaserLib as unknown as Phaser;

    class MainScene extends Phaser.Scene {
      private playerMovement!: PlayerMovement;
      private mapDisplay!: MuseumMapDisplay;
      private nearExhibit: ExhibitData | null = null;
      private nearLockedDoor: number | null = null;
      private nearPicture: {
        id: number;
        imagePath: string;
        caption: string;
      } | null = null;
      private nearInfoPoint: ExhibitData | null = null;
      private interactKey!: Phaser.Input.Keyboard.Key;
      private promptText!: Phaser.GameObjects.Text;
      private chatBox!: ChatBox;
      private exhibits: Phaser.Physics.Arcade.Sprite[] = [];
      private infoPoints: {
        exhibit: ExhibitData;
        sprite: Phaser.GameObjects.Sprite;
      }[] = [];
      private quizPoint: {
        collision: Phaser.GameObjects.Rectangle;
        sprite: Phaser.GameObjects.Sprite;
      } | null = null;
      private nearQuizPoint: boolean = false;
      private currentRoom: number = 1;
      private roomTriggers: { [key: number]: Phaser.Geom.Rectangle } = {};
      private lockedDoors: {
        collision: Phaser.GameObjects.Rectangle;
        roomNumber: number;
      }[] = [];
      private pictures: {
        collision: Phaser.GameObjects.Rectangle;
        id: number;
        imagePath: string;
        caption: string;
      }[] = [];
      private columns: {
        collision: Phaser.GameObjects.Rectangle;
        roomNumber: number;
        title: string;
      }[] = [];
      private roomBorders: {
        room2Border: Phaser.GameObjects.Rectangle;
        room3Border: Phaser.GameObjects.Rectangle;
      } | null = null;
      private backButtons: {
        bg: Phaser.GameObjects.Rectangle;
        text: Phaser.GameObjects.Text;
        room: number;
      }[] = [];
      private goToRoomButtons: {
        bg: Phaser.GameObjects.Rectangle;
        text: Phaser.GameObjects.Text;
        room: number;
      }[] = [];
      private topBorder!: Phaser.GameObjects.Rectangle;
      private map!: Phaser.Tilemaps.Tilemap;
      private layer1!: Phaser.Tilemaps.TilemapLayer;
      private layer2!: Phaser.Tilemaps.TilemapLayer;
      private layer3!: Phaser.Tilemaps.TilemapLayer;
      private map2!: Phaser.Tilemaps.Tilemap;
      private map2wall!: Phaser.Tilemaps.TilemapLayer;
      private map2floor!: Phaser.Tilemaps.TilemapLayer;
      private map3!: Phaser.Tilemaps.Tilemap;
      private map3wall!: Phaser.Tilemaps.TilemapLayer;
      private map3floor1!: Phaser.Tilemaps.TilemapLayer;
      private map3floor2!: Phaser.Tilemaps.TilemapLayer;

      constructor() {
        super({ key: "MainScene" });
      }

      preload() {
        this.load.spritesheet("player", "/sprites/Adam_run.png", {
          frameWidth: 16,
          frameHeight: 32,
        });

        this.load.tilemapTiledJSON("map1", "/tiles/map1.json");
        this.load.tilemapTiledJSON("map2", "/tiles/map2.json");
        this.load.tilemapTiledJSON("map3", "/tiles/map3.json");
        this.load.image("room", "/tiles/room.png");
        this.load.image("interior", "/tiles/interior.png");
        this.load.image("Dungeon_Tileset", "/tiles/Dungeon_Tileset.png");
        this.load.image(
          "antarcticbees_interior",
          "/tiles/antarcticbees_interior_free_sample-export.png"
        );

        this.createInfoPointGraphic();
        this.createQuizPointGraphic();
      }

      createInfoPointGraphic() {
        const graphics = this.make.graphics({ x: 0, y: 0 });

        graphics.fillStyle(0x3b82f6, 1);
        graphics.fillCircle(40, 40, 35);

        graphics.fillStyle(0xffffff, 1);
        graphics.fillCircle(40, 25, 5);
        graphics.fillRect(35, 35, 10, 25);

        graphics.generateTexture("info-point", 80, 80);
        graphics.destroy();
      }

      createQuizPointGraphic() {
        const graphics = this.make.graphics({ x: 0, y: 0 });
        graphics.fillStyle(0xf59e0b, 1);
        graphics.fillCircle(40, 40, 35);

        graphics.fillStyle(0xffffff, 1);
        graphics.fillTriangle(40, 15, 30, 35, 50, 35);
        graphics.fillTriangle(40, 65, 30, 45, 50, 45);

        graphics.generateTexture("quiz-point", 80, 80);
        graphics.destroy();
      }

      create() {
        this.physics.world.setBounds(0, 0, 9000, 1200);

        for (let x = 0; x < 9000; x += 120) {
          for (let y = 0; y < 1200; y += 120) {
            const baseColor = (x + y) % 240 === 0 ? 0x374151 : 0x2d3748;
            this.add.rectangle(x + 60, y + 60, 118, 118, baseColor);
          }
        }

        this.add.rectangle(4500, 100, 800, 80, 0x0f3460);
        this.add
          .text(4500, 100, "BẢO TÀNG KHOA HỌC CHÍNH TRỊ", {
            fontSize: "32px",
            color: "#e8e8e8",
            fontStyle: "bold",
          })
          .setOrigin(0.5);

        for (let i = 1; i <= 8; i++) {
          const x = i * 1000;

          this.createWall(x, 250, 40, 460, 0x1e293b);
          this.createWall(x, 950, 40, 460, 0x1e293b);

          if (!unlockedRooms.has(i + 1)) {
            const doorCollision = this.add.rectangle(
              x,
              600,
              40,
              200,
              0xff0000,
              0
            );
            this.physics.add.existing(doorCollision, true);

            this.lockedDoors.push({
              collision: doorCollision,
              roomNumber: i + 1,
            });

            const lockIcon = this.add
              .text(x, 600 - 120, "🔒", {
                fontSize: "32px",
              })
              .setOrigin(0.5);
            lockIcon.setDepth(10);
          }
        }

        this.playerMovement = new PlayerMovement(this, username);

        const startX = playerPositionRef.current?.x || 400;
        const startY = playerPositionRef.current?.y || 400;

        const player = this.playerMovement.createPlayer(startX, startY);

        this.cameras.main.startFollow(player, true, 0.1, 0.1);
        this.cameras.main.centerOn(player.x, player.y);

        this.map = this.make.tilemap({ key: "map1" });
        const tileset1 = this.map.addTilesetImage("room", "room")!;
        const tileset2 = this.map.addTilesetImage("interior", "interior")!;

        this.layer1 = this.map.createLayer(
          "layer1",
          [tileset1, tileset2],
          0,
          0
        )!;
        this.layer2 = this.map.createLayer(
          "layer2",
          [tileset1, tileset2],
          0,
          0
        )!;
        this.layer3 = this.map.createLayer(
          "layer3",
          [tileset1, tileset2],
          0,
          0
        )!;

        this.layer1.setVisible(true);
        this.layer2.setVisible(true);
        this.layer3.setVisible(true);

        this.layer3.setDepth(0);
        this.layer2.setDepth(1);
        this.layer1.setDepth(2);

        this.map2 = this.make.tilemap({ key: "map2" });
        const map2tileset = this.map2.addTilesetImage(
          "Dungeon_Tileset",
          "Dungeon_Tileset"
        )!;

        this.map2floor = this.map2.createLayer(
          "Floor0",
          [map2tileset],
          this.map.widthInPixels,
          0
        )!;
        this.map2wall = this.map2.createLayer(
          "Floor1",
          [map2tileset],
          this.map.widthInPixels,
          0
        )!;

        this.map2floor.setVisible(true);
        this.map2wall.setVisible(true);

        this.map2floor.setDepth(3);
        this.map2wall.setDepth(4);

        this.add
          .rectangle(
            this.map.widthInPixels + this.map2.widthInPixels / 2,
            this.map2.heightInPixels / 2,
            this.map2.widthInPixels,
            this.map2.heightInPixels,
            0xff0000,
            0.3
          )
          .setDepth(6);

        this.map3 = this.make.tilemap({ key: "map3" });

        const map3tileset = this.map3.addTilesetImage(
          "antarcticbees_interior_free_sample-export",
          "antarcticbees_interior"
        )!;

        const map3OffsetX = this.map.widthInPixels + this.map2.widthInPixels;

        this.map3floor1 = this.map3.createLayer(
          "floor1",
          [map3tileset],
          map3OffsetX,
          0
        )!;
        this.map3floor2 = this.map3.createLayer(
          "floor2",
          [map3tileset],
          map3OffsetX,
          0
        )!;
        this.map3wall = this.map3.createLayer(
          "wall",
          [map3tileset],
          map3OffsetX,
          0
        )!;

        this.map3floor1.setVisible(true);
        this.map3floor2.setVisible(true);
        this.map3wall.setVisible(true);

        this.map3floor1.setDepth(5);
        this.map3floor2.setDepth(6);
        this.map3wall.setDepth(7);

        this.add
          .rectangle(
            map3OffsetX + this.map3.widthInPixels / 2,
            this.map3.heightInPixels / 2,
            this.map3.widthInPixels,
            this.map3.heightInPixels,
            0x00ff00,
            0.3
          )
          .setDepth(8);

        this.physics.world.setBounds(
          0,
          0,
          this.map.widthInPixels +
            this.map2.widthInPixels +
            this.map3.widthInPixels,
          Math.max(
            this.map.heightInPixels,
            this.map2.heightInPixels,
            this.map3.heightInPixels
          )
        );

        const totalWidth =
          this.map.widthInPixels +
          this.map2.widthInPixels +
          this.map3.widthInPixels;
        const cameraHeight = Math.max(
          this.map.heightInPixels,
          this.map2.heightInPixels,
          this.map3.heightInPixels
        );

        const gamePlayer = this.playerMovement.getPlayer();
        if (gamePlayer) {
          this.cameras.main.setZoom(0.9);
          this.cameras.main.setBounds(0, 0, totalWidth, cameraHeight);
          this.cameras.main.startFollow(gamePlayer, true, 1, 1);
          this.cameras.main.centerOn(gamePlayer.x, gamePlayer.y);
        }

        this.topBorder = this.add.rectangle(
          this.map.widthInPixels / 2 +
            this.map2.widthInPixels / 2 +
            this.map3.widthInPixels / 2,
          30,
          this.map.widthInPixels +
            this.map2.widthInPixels +
            this.map3.widthInPixels,
          20,
          0xff0000,
          0
        );
        this.physics.add.existing(this.topBorder, true);

        this.add.rectangle(
          720 + this.map.widthInPixels,
          100,
          600,
          60,
          0x0f3460
        );
        this.add
          .text(
            720 + this.map.widthInPixels,
            100,
            "PHÒNG 2: BẢN CHẤT & HÌNH THỨC",
            {
              fontSize: "24px",
              color: "#e8e8e8",
              fontStyle: "bold",
            }
          )
          .setOrigin(0.5)
          .setDepth(10);

        this.add.rectangle(
          720 + this.map.widthInPixels + this.map2.widthInPixels,
          100,
          600,
          60,
          0x0f3460
        );
        this.add
          .text(
            720 + this.map.widthInPixels + this.map2.widthInPixels,
            100,
            "PHÒNG 3: NGHIÊN CỨU KHOA HỌC",
            {
              fontSize: "24px",
              color: "#e8e8e8",
              fontStyle: "bold",
            }
          )
          .setOrigin(0.5)
          .setDepth(10);

        this.refreshBackButtons();

        this.createInfoPoints();
        this.createPictures();
        this.createRoomBorders();

        if (this.roomBorders && this.roomBorders.room2Border) {
          this.physics.add.collider(player, this.roomBorders.room2Border);
        }
        if (this.roomBorders && this.roomBorders.room3Border) {
          this.physics.add.collider(player, this.roomBorders.room3Border);
        }

        this.roomTriggers = {
          1: new Phaser.Geom.Rectangle(40, 260, 1380, 680),
          2: new Phaser.Geom.Rectangle(1480, 260, 1380, 680),
          3: new Phaser.Geom.Rectangle(2920, 260, 1380, 680),
        };

        this.interactKey = this.input.keyboard!.addKey(
          Phaser.Input.Keyboard.KeyCodes.E
        );

        this.promptText = this.add
          .text(0, 0, "Nhấn E để xem nội dung", {
            fontSize: "18px",
            color: "#ffffff",
            backgroundColor: "#000000",
            padding: { x: 12, y: 6 },
          })
          .setOrigin(0.5)
          .setVisible(false)
          .setScrollFactor(0)
          .setDepth(100);

        this.createChat();

        this.interactKey.on("down", () => {
          if (this.nearQuizPoint) {
            window.dispatchEvent(new Event("quizPointInteract"));
          } else if (this.nearInfoPoint !== null) {
            (window as any).handleExhibitInteract?.(this.nearInfoPoint);
          } else if (this.nearPicture !== null) {
            this.showPictureModal(
              this.nearPicture.imagePath,
              this.nearPicture.caption
            );
          } else if (this.nearLockedDoor !== null) {
            (window as any).handleDoorInteract?.(this.nearLockedDoor);
          }
        });

        if (this.roomBorders) {
          if (
            this.roomBorders.room2Border &&
            this.roomBorders.room2Border.body
          ) {
            this.physics.add.collider(player, this.roomBorders.room2Border);
          }
          if (
            this.roomBorders.room3Border &&
            this.roomBorders.room3Border.body
          ) {
            this.physics.add.collider(player, this.roomBorders.room3Border);
          }
        }

        this.physics.add.collider(player, this.topBorder);
      }

      createColumn(x: number, y: number, roomNumber: number, title: string) {
        const pillar = this.add.rectangle(x, y, 60, 60, 0x8b7355);
        this.add.rectangle(x, y, 50, 50, 0xa67c52);
        this.add.rectangle(x, y, 40, 40, 0xd4af37);
        pillar.setDepth(3);

        const columnCollision = this.add.rectangle(x, y, 60, 60, 0xff0000, 0);
        this.physics.add.existing(columnCollision, true);

        this.columns.push({
          collision: columnCollision,
          roomNumber: roomNumber,
          title: title,
        });

        this.add
          .text(x, y + 50, title, {
            fontSize: "10px",
            color: "#fbbf24",
            fontStyle: "bold",
            align: "center",
          })
          .setOrigin(0.5)
          .setDepth(4);
      }

      createRoomBorders() {
        const room2BorderX = this.map.widthInPixels;
        const room2BorderY = this.map.heightInPixels / 2;
        const room2Border = this.add.rectangle(
          room2BorderX,
          room2BorderY,
          20,
          this.map.heightInPixels,
          0xff0000,
          0
        );
        this.physics.add.existing(room2Border, true);

        const room3BorderX = this.map.widthInPixels + this.map2.widthInPixels;
        const room3BorderY = this.map2.heightInPixels / 2;
        const room3Border = this.add.rectangle(
          room3BorderX,
          room3BorderY,
          20,
          this.map2.heightInPixels,
          0xff0000,
          0
        );
        this.physics.add.existing(room3Border, true);

        this.roomBorders = {
          room2Border,
          room3Border,
        };

        this.add
          .text(
            room2BorderX - 50,
            room2BorderY - 100,
            "🔒 PHÒNG 2\nLàm quiz để mở",
            {
              fontSize: "14px",
              color: "#fbbf24",
              fontStyle: "bold",
              align: "center",
            }
          )
          .setOrigin(0.5)
          .setDepth(10);

        this.add
          .text(
            room3BorderX - 50,
            room3BorderY - 100,
            "🔒 PHÒNG 3\nLàm quiz để mở",
            {
              fontSize: "14px",
              color: "#fbbf24",
              fontStyle: "bold",
              align: "center",
            }
          )
          .setOrigin(0.5)
          .setDepth(10);
      }

      createPictures() {
        const roomWidth = this.map.widthInPixels;
        const sectionWidth = roomWidth / 6;

        const picturePositions = [
          {
            x: sectionWidth * 0.5,
            y: 100,
            id: 1,
            imagePath: "/pic/r1-e3.jpg",
            caption:
              "Đài phát thanh Mễ Trì của Đài Tiếng nói Việt Nam (VOV) bị tấn công vào đêm 18 tháng 12. Mặc dù thiệt hại về tài sản nặng nề, VOV vẫn tiếp tục phát sóng sau 9 phút im lặng.",
          },
          {
            x: sectionWidth * 1.5,
            y: 100,
            id: 2,
            imagePath: "/pic/r1-e4.jpg",
            caption:
              "Các hầm trú bom ven đường cá nhân được dựng lên dọc theo các con phố.",
          },
          {
            x: sectionWidth * 2.5,
            y: 100,
            id: 3,
            imagePath: "/pic/r2-e3.jpg",
            caption:
              "Đơn vị không quân Sao Đỏ đã góp phần vào chiến thắng của trận chiến.",
          },
          {
            x: sectionWidth * 3.5,
            y: 100,
            id: 4,
            imagePath: "/pic/r1-e5.jpg",
            caption: "Một phi công Mỹ bị bắt trên hồ Trúc Bạch ở Hà Nội.",
          },
          {
            x: sectionWidth * 4.5,
            y: 100,
            id: 5,
            imagePath: "/pic/r1-e6.jpg",
            caption:
              "Bữa ăn hàng ngày của các phi công bị bắt tại Nhà tù Hỏa Lò ở Hà Nội.",
          },
          {
            x: sectionWidth * 5.5,
            y: 100,
            id: 6,
            imagePath: "/pic/r1-e7.jpg",
            caption:
              "Thất bại của các cuộc không kích đã buộc Mỹ và tay sai phải ngồi vào bàn đàm phán năm 1973 và ký Hiệp định Paris, chấm dứt chiến tranh ở Việt Nam. Trong ảnh, bà Nguyễn Thị Bình, Bộ trưởng Ngoại giao Chính phủ Cách mạng Lâm thời Cộng hòa miền Nam Việt Nam, đã ký hiệp định vào ngày 27 tháng 1 năm 1973.",
          },
        ];

        picturePositions.forEach((pos) => {
          const collision = this.add.rectangle(
            pos.x,
            pos.y,
            100,
            60,
            0xff0000,
            0
          );
          this.physics.add.existing(collision, true);

          this.pictures.push({
            collision: collision,
            id: pos.id,
            imagePath: pos.imagePath,
            caption: pos.caption,
          });
        });
      }

      createInfoPoints() {
        const room1Exhibits = museumData
          .filter((exhibit) => exhibit.roomNumber === 1)
          .slice(0, 2);
        const room2Exhibits = museumData
          .filter((exhibit) => exhibit.roomNumber === 2)
          .slice(0, 2);
        const room3Exhibits = museumData
          .filter((exhibit) => exhibit.roomNumber === 3)
          .slice(0, 2);

        const room1Positions = [
          { x: 300, y: 300 },
          { x: 300, y: 600 },
        ];
        room1Exhibits.forEach((exhibit, index) => {
          const pos = room1Positions[index];
          this.createInfoPoint(pos.x, pos.y, exhibit);
        });

        const room2Positions = [
          { x: this.map.widthInPixels + 300, y: 300 },
          { x: this.map.widthInPixels + 300, y: 600 },
        ];

        room2Exhibits.forEach((exhibit, index) => {
          const pos = room2Positions[index];
          this.createInfoPoint(pos.x, pos.y, exhibit);
        });

        const room3Positions = [
          { x: this.map.widthInPixels + this.map2.widthInPixels + 300, y: 300 },
          { x: this.map.widthInPixels + this.map2.widthInPixels + 300, y: 600 },
        ];

        room3Exhibits.forEach((exhibit, index) => {
          const pos = room3Positions[index];
          this.createInfoPoint(pos.x, pos.y, exhibit);
        });
      }

      createComprehensiveQuizPoint() {
        const map3OffsetX = this.map.widthInPixels + this.map2.widthInPixels;
        const x = map3OffsetX + this.map3.widthInPixels / 2;
        const y = this.map3.heightInPixels / 2;

        const sprite = this.add.sprite(x, y, "quiz-point");
        sprite.setDepth(10);
        sprite.setScale(0.9);
        this.tweens.add({
          targets: sprite,
          scale: 1.05,
          duration: 1200,
          yoyo: true,
          repeat: -1,
          ease: "Sine.easeInOut",
        });

        const collision = this.add.rectangle(x, y, 120, 120, 0xff0000, 0);
        this.physics.add.existing(collision, true);

        this.add
          .text(x, y + 80, "Quiz tổng hợp (Phòng 1–3)", {
            fontSize: "14px",
            color: "#e8e8e8",
            backgroundColor: "#000000",
            padding: { x: 8, y: 4 },
            align: "center",
            wordWrap: { width: 260 },
          })
          .setOrigin(0.5)
          .setDepth(10);

        this.quizPoint = { collision, sprite };
      }

      createInfoPoint(x: number, y: number, exhibit: ExhibitData) {
        const sprite = this.add.sprite(x, y, "info-point");
        sprite.setDepth(5);
        sprite.setScale(0.8);
        sprite.setInteractive();

        this.tweens.add({
          targets: sprite,
          scale: 1,
          duration: 1000,
          yoyo: true,
          repeat: -1,
          ease: "Sine.easeInOut",
        });

        this.add
          .text(x, y + 60, exhibit.title, {
            fontSize: "12px",
            color: "#e8e8e8",
            backgroundColor: "#000000",
            padding: { x: 8, y: 4 },
            align: "center",
            wordWrap: { width: 200 },
          })
          .setOrigin(0.5)
          .setDepth(5);

        sprite.on("pointerdown", () => {
          (window as any).handleExhibitInteract(exhibit);
        });

        this.infoPoints.push({
          sprite: sprite,
          exhibit: exhibit,
        });
      }

      updateCameraBounds(roomNumber: number) {
        switch (roomNumber) {
          case 1:
            this.cameras.main.setBounds(50, 150, 1340, 500);
            break;
          case 2:
            this.cameras.main.setBounds(1490, 150, 1340, 500);
            break;
          case 3:
            this.cameras.main.setBounds(2930, 150, 1340, 500);
            break;
          default:
            this.cameras.main.setBounds(0, 150, 9000, 500);
        }
      }

      showPictureModal(imagePath: string, caption: string) {
        this.scene.pause();

        (window as any).showPictureModal?.(imagePath, caption);
      }

      createBackToRoom1Button(x: number, y: number, fromRoom: number) {
        const buttonBg = this.add.rectangle(x, y, 200, 50, 0x3366cc, 0.8);
        buttonBg.setStrokeStyle(2, 0x4488ff);
        buttonBg.setDepth(10);
        buttonBg.setInteractive({ cursor: "pointer" });

        const buttonText = this.add.text(x, y, "VỀ PHÒNG 1", {
          fontSize: "16px",
          color: "#ffffff",
          fontStyle: "bold",
        });
        buttonText.setOrigin(0.5);
        buttonText.setDepth(11);

        // Store button references for later removal if needed
        if (!this.backButtons) {
          this.backButtons = [];
        }
        this.backButtons.push({
          bg: buttonBg,
          text: buttonText,
          room: fromRoom,
        });

        // Add hover effects
        buttonBg.on("pointerover", () => {
          buttonBg.setFillStyle(0x4488ff, 0.9);
          this.tweens.add({
            targets: [buttonBg, buttonText],
            scaleX: 1.05,
            scaleY: 1.05,
            duration: 100,
            ease: "Power2",
          });
        });

        buttonBg.on("pointerout", () => {
          buttonBg.setFillStyle(0x3366cc, 0.8);
          this.tweens.add({
            targets: [buttonBg, buttonText],
            scaleX: 1,
            scaleY: 1,
            duration: 100,
            ease: "Power2",
          });
        });

        // Add click event
        buttonBg.on("pointerdown", () => {
          this.teleportToRoom1(fromRoom);
        });
      }

      createGoToRoomButton(x: number, y: number, toRoom: number) {
        // Create button background
        const buttonBg = this.add.rectangle(
          x,
          y,
          200,
          50,
          toRoom === 2 ? 0x22c55e : 0x3b82f6,
          0.8
        );
        buttonBg.setStrokeStyle(2, toRoom === 2 ? 0x16a34a : 0x2563eb);
        buttonBg.setDepth(10);
        buttonBg.setInteractive({ cursor: "pointer" });

        // Create button text
        const buttonText = this.add.text(x, y, `ĐI TỚI PHÒNG ${toRoom}`, {
          fontSize: "16px",
          color: "#ffffff",
          fontStyle: "bold",
        });
        buttonText.setOrigin(0.5);
        buttonText.setDepth(11);

        // Add to tracking array
        if (!this.goToRoomButtons) {
          this.goToRoomButtons = [];
        }
        this.goToRoomButtons.push({
          bg: buttonBg,
          text: buttonText,
          room: toRoom,
        });

        // Add hover effects
        buttonBg.on("pointerover", () => {
          buttonBg.setFillStyle(toRoom === 2 ? 0x16a34a : 0x2563eb, 0.9);
          this.tweens.add({
            targets: [buttonBg, buttonText],
            scaleX: 1.05,
            scaleY: 1.05,
            duration: 100,
            ease: "Power2",
          });
        });

        buttonBg.on("pointerout", () => {
          buttonBg.setFillStyle(toRoom === 2 ? 0x22c55e : 0x3b82f6, 0.8);
          this.tweens.add({
            targets: [buttonBg, buttonText],
            scaleX: 1,
            scaleY: 1,
            duration: 100,
            ease: "Power2",
          });
        });

        // Add click event
        buttonBg.on("pointerdown", () => {
          this.teleportToRoom(toRoom);
        });
      }

      teleportToRoom(roomNumber: number) {
        const player = this.playerMovement.getPlayer();
        // Create teleport effect
        const teleportEffect = this.add.circle(
          player.x,
          player.y,
          0,
          roomNumber === 2 ? 0x22c55e : 0x3b82f6,
          0.6
        );
        teleportEffect.setDepth(15);

        this.tweens.add({
          targets: teleportEffect,
          radius: 100,
          alpha: 0,
          duration: 500,
          ease: "Power2",
          onComplete: () => {
            teleportEffect.destroy();
          },
        });

        // Calculate target position
        let targetX: number;
        if (roomNumber === 2) {
          targetX = this.map.widthInPixels + 100; // Room 2 position
        } else if (roomNumber === 3) {
          targetX = this.map.widthInPixels + this.map2.widthInPixels + 100; // Room 3 position
        } else {
          targetX = 720; // Default to room 1 center
        }

        // Teleport player
        this.playerMovement.teleportTo(targetX, 480);

        // Update position reference
        (window as any).playerPositionRef.current = { x: targetX, y: 480 };

        // Show success message
        const roomNames = {
          2: "PHÒNG 2: BẢN CHẤT & HÌNH THỨC",
          3: "PHÒNG 3: NGHIÊN CỨU KHOA HỌC",
        };

        const successMessage = this.add.text(
          targetX,
          400,
          `✅ Chào mừng đến ${
            roomNames[roomNumber as keyof typeof roomNames]
          }!`,
          {
            fontSize: "18px",
            color: roomNumber === 2 ? "#22c55e" : "#3b82f6",
            fontStyle: "bold",
            backgroundColor: "#000000",
            padding: { x: 10, y: 5 },
          }
        );
        successMessage.setOrigin(0.5);
        successMessage.setDepth(20);

        // Auto remove success message
        this.time.delayedCall(3000, () => {
          if (successMessage && successMessage.scene) {
            successMessage.destroy();
          }
        });
      }

      refreshBackButtons() {
        // Clear existing back buttons
        if (this.backButtons) {
          this.backButtons.forEach((button) => {
            button.bg.destroy();
            button.text.destroy();
          });
          this.backButtons = [];
        }

        // Clear existing go-to-room buttons
        if (this.goToRoomButtons) {
          this.goToRoomButtons.forEach((button) => {
            button.bg.destroy();
            button.text.destroy();
          });
          this.goToRoomButtons = [];
        }

        // Recreate back buttons for unlocked rooms (in rooms 2 and 3)
        const currentUnlockedRooms = (window as any).unlockedRooms;
        if (currentUnlockedRooms && currentUnlockedRooms.has(2)) {
          this.createBackToRoom1Button(this.map.widthInPixels + 100, 200, 2);
        }
        if (currentUnlockedRooms && currentUnlockedRooms.has(3)) {
          this.createBackToRoom1Button(
            this.map.widthInPixels + this.map2.widthInPixels + 100,
            200,
            3
          );
        }

        // Create go-to-room buttons in room 1 for unlocked rooms
        let buttonY = 300; // Starting Y position for buttons in room 1
        if (currentUnlockedRooms && currentUnlockedRooms.has(2)) {
          this.createGoToRoomButton(720, buttonY, 2); // Center of room 1, go to room 2
          buttonY += 70; // Move next button down
        }
        if (currentUnlockedRooms && currentUnlockedRooms.has(3)) {
          this.createGoToRoomButton(720, buttonY, 3); // Center of room 1, go to room 3
        }
      }

      teleportToRoom1(fromRoom: number) {
        const player = this.playerMovement.getPlayer();
        // Create teleport effect
        const teleportEffect = this.add.circle(
          player.x,
          player.y,
          0,
          0x00aaff,
          0.6
        );
        teleportEffect.setDepth(15);

        this.tweens.add({
          targets: teleportEffect,
          radius: 100,
          alpha: 0,
          duration: 500,
          ease: "Power2",
          onComplete: () => {
            teleportEffect.destroy();
          },
        });

        // Teleport player to room 1 center
        this.playerMovement.teleportTo(720, 480);

        // Update position reference
        (window as any).playerPositionRef.current = { x: 720, y: 480 };

        // Refresh buttons to show available rooms
        this.refreshBackButtons();

        // Show success message
        const successMessage = this.add.text(720, 400, `Đã quay về Phòng 1!`, {
          fontSize: "20px",
          color: "#00ff88",
          fontStyle: "bold",
          backgroundColor: "#000000",
          padding: { x: 10, y: 5 },
        });
        successMessage.setOrigin(0.5);
        successMessage.setDepth(20);

        this.time.delayedCall(3000, () => {
          if (successMessage && successMessage.scene) {
            successMessage.destroy();
          }
        });
      }

      unlockRoom(roomNumber: number) {
        const teleportPositions = {
          2: { x: this.map.widthInPixels + 100, y: 480 }, // Room 2 entrance
          3: {
            x: this.map.widthInPixels + this.map2.widthInPixels + 100,
            y: 480,
          },
        };

        if (roomNumber === 2) {
          const targetPos = teleportPositions[2];
          const player = this.playerMovement.getPlayer();

          const teleportEffect = this.add.circle(
            player.x,
            player.y,
            50,
            0x00ff00,
            0.8
          );
          teleportEffect.setDepth(200);

          // Animate teleport effect
          this.tweens.add({
            targets: teleportEffect,
            scaleX: 2,
            scaleY: 2,
            alpha: 0,
            duration: 500,
            onComplete: () => {
              teleportEffect.destroy();
            },
          });

          this.playerMovement.teleportTo(targetPos.x, targetPos.y);

          (window as any).playerPositionRef.current = {
            x: targetPos.x,
            y: targetPos.y,
          };

          const successText = this.add
            .text(
              targetPos.x,
              targetPos.y - 100,
              "✅ CHÀO MỪNG ĐÊN PHÒNG 2!\n🎉 Quiz hoàn thành!",
              {
                fontSize: "16px",
                color: "#22c55e",
                fontStyle: "bold",
                align: "center",
                backgroundColor: "#000000",
                padding: { x: 10, y: 10 },
              }
            )
            .setOrigin(0.5)
            .setDepth(150);

          // Remove success message after 3 seconds
          this.time.delayedCall(3000, () => {
            if (successText) {
              successText.destroy();
            }
          });
        } else if (roomNumber === 3) {
          const targetPos = teleportPositions[3];
          const player = this.playerMovement.getPlayer();

          const teleportEffect = this.add.circle(
            player.x,
            player.y,
            50,
            0x0099ff,
            0.8
          );
          teleportEffect.setDepth(200);

          // Animate teleport effect
          this.tweens.add({
            targets: teleportEffect,
            scaleX: 2,
            scaleY: 2,
            alpha: 0,
            duration: 500,
            onComplete: () => {
              teleportEffect.destroy();
            },
          });

          // Teleport player
          this.playerMovement.teleportTo(targetPos.x, targetPos.y);

          // Update player position ref for persistence
          (window as any).playerPositionRef.current = {
            x: targetPos.x,
            y: targetPos.y,
          };

          // Show success message
          const successText = this.add
            .text(
              targetPos.x,
              targetPos.y - 100,
              "✅ CHÀO MỪNG ĐÊN PHÒNG 3!\n🔬 Khám phá khoa học!",
              {
                fontSize: "16px",
                color: "#22c55e",
                fontStyle: "bold",
                align: "center",
                backgroundColor: "#000000",
                padding: { x: 10, y: 10 },
              }
            )
            .setOrigin(0.5)
            .setDepth(150);

          // Remove success message after 3 seconds
          this.time.delayedCall(3000, () => {
            if (successText) {
              successText.destroy();
            }
          });
        }

        // Refresh back buttons after unlocking a room
        this.refreshBackButtons();
      }

      createPillar(x: number, y: number) {
        const pillar = this.add.rectangle(x, y, 40, 40, 0x8b7355);
        this.add.rectangle(x, y, 35, 35, 0xa67c52);
        pillar.setDepth(2);

        const pillarCollision = this.add.rectangle(x, y, 40, 40, 0xff0000, 0);
        this.physics.add.existing(pillarCollision, true);
        // this.walls.push(pillarCollision); // Managed by mapDisplay now

        return pillar;
      }

      update() {
        if (!this.playerMovement) return;

        this.playerMovement.update();
        const player = this.playerMovement.getPlayer();

        if (player && this.cameras.main) {
          this.cameras.main.centerOn(player.x, player.y);
        }

        this.nearLockedDoor = null;
        if (this.roomBorders) {
          const door2X = this.map.widthInPixels;
          const door2Y = this.map.heightInPixels / 2;
          const distanceToDoor2 = Phaser.Math.Distance.Between(
            player.x,
            player.y,
            door2X,
            door2Y
          );

          const door3X = this.map.widthInPixels + this.map2.widthInPixels;
          const door3Y = this.map2.heightInPixels / 2;
          const distanceToDoor3 = Phaser.Math.Distance.Between(
            player.x,
            player.y,
            door3X,
            door3Y
          );

          if (distanceToDoor2 < 100) {
            this.nearLockedDoor = 2;
          } else if (distanceToDoor3 < 100) {
            this.nearLockedDoor = 3;
          }
        }

        this.nearQuizPoint = false;
        if (this.quizPoint) {
          const distance = Phaser.Math.Distance.Between(
            player.x,
            player.y,
            this.quizPoint.collision.x,
            this.quizPoint.collision.y
          );
          if (distance < 90) {
            this.nearQuizPoint = true;
          }
        }

        this.nearPicture = null;
        for (const picture of this.pictures) {
          const distance = Phaser.Math.Distance.Between(
            player.x,
            player.y,
            picture.collision.x,
            picture.collision.y
          );

          if (distance < 80) {
            this.nearPicture = {
              id: picture.id,
              imagePath: picture.imagePath,
              caption: picture.caption,
            };
            break;
          }
        }

        this.nearInfoPoint = null;
        for (const infoPoint of this.infoPoints) {
          const distance = Phaser.Math.Distance.Between(
            player.x,
            player.y,
            infoPoint.sprite.x,
            infoPoint.sprite.y
          );

          if (distance < 80) {
            this.nearInfoPoint = infoPoint.exhibit;
            break;
          }
        }

        if (this.nearQuizPoint) {
          this.promptText.setText("Nhấn E để làm quiz tổng hợp");
          this.promptText.setVisible(true);
          this.promptText.setPosition(
            (this.sys.game.config.width as number) / 2,
            (this.sys.game.config.height as number) - 60
          );
        } else if (this.nearInfoPoint !== null) {
          this.promptText.setText("Nhấn E để xem thông tin");
          this.promptText.setVisible(true);
          this.promptText.setPosition(
            (this.sys.game.config.width as number) / 2,
            (this.sys.game.config.height as number) - 60
          );
        } else if (this.nearPicture !== null) {
          this.promptText.setText("Nhấn E để xem bức tranh");
          this.promptText.setVisible(true);
          this.promptText.setPosition(
            (this.sys.game.config.width as number) / 2,
            (this.sys.game.config.height as number) - 60
          );
        } else if (this.nearLockedDoor !== null) {
          this.promptText.setText(
            `Nhấn E để làm quiz mở khóa Phòng ${this.nearLockedDoor}`
          );
          this.promptText.setVisible(true);
          this.promptText.setPosition(
            (this.sys.game.config.width as number) / 2,
            (this.sys.game.config.height as number) - 60
          );
        } else {
          this.promptText.setVisible(false);
        }

        (window as any).playerPositionRef.current = {
          x: player.x,
          y: player.y,
        };

        window.dispatchEvent(
          new CustomEvent("playerMove", {
            detail: { x: player.x, y: player.y },
          })
        );
      }

      createWall(
        x: number,
        y: number,
        width: number,
        height: number,
        color: number
      ) {
        const wall = this.add.rectangle(x, y, width, height, color);
        this.physics.add.existing(wall, true);
        // this.walls.push(wall); // Managed by mapDisplay now
        return wall;
      }

      createChat() {
        this.chatBox = new ChatBox(this, username, (enabled: boolean) => {
          this.playerMovement.setMovementEnabled(enabled);
        });
        this.chatBox.create();
      }
    }

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      parent: gameRef.current,
      width: window.innerWidth,
      height: window.innerHeight - 100,
      physics: {
        default: "arcade",
        arcade: {
          gravity: { x: 0, y: 0 },
          debug: false,
        },
      },
      scene: MainScene,
      backgroundColor: "#1a1a2e",
    };

    const game = new Phaser.Game(config);
    phaserGameRef.current = game;

    (window as any).handleExhibitInteract = onExhibitInteract;
    (window as any).handleDoorInteract = onDoorInteract;
    (window as any).showPictureModal = (imagePath: string, caption: string) => {
      setCurrentPicture(imagePath);
      setCurrentCaption(caption);
      setPictureModalOpen(true);
    };
    (window as any).playerPositionRef = playerPositionRef;
    (window as any).unlockedRooms = unlockedRooms;
    (window as any).unlockRoom = (roomNumber: number) => {
      const scene = game.scene.getScene("MainScene") as MainScene;
      if (scene && scene.unlockRoom) {
        scene.unlockRoom(roomNumber);
      }
    };

    return () => {
      game.destroy(true);
      phaserGameRef.current = null;
    };
  }, [
    onExhibitInteract,
    onDoorInteract,
    visitedExhibits,
    unlockedRooms,
    username,
  ]);

  const handlePictureModalClose = () => {
    setPictureModalOpen(false);
    if (phaserGameRef.current) {
      const scene = phaserGameRef.current.scene.getScene("MainScene");
      if (scene) {
        scene.scene.resume();
      }
    }
  };

  return (
    <>
      <div ref={gameRef} className="w-full h-full" />
      <PictureModal
        isOpen={pictureModalOpen}
        onClose={handlePictureModalClose}
        imagePath={currentPicture}
        caption={currentCaption}
      />
    </>
  );
}
