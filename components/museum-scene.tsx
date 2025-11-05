"use client";

import { useEffect, useRef, useState } from "react";
const PhaserLib = typeof window !== "undefined" ? require("phaser") : null;
type Phaser = typeof import("phaser");
import type { ExhibitData } from "@/types/museum";
import PictureModal from "@/components/picture-modal";
import { PlayerMovement } from "@/components/player-movement";
import { ChatBox } from "@/components/chat-box";
import { LeaderboardModal } from "@/components/leaderboard-modal";
import { gameClient } from "@/lib/game-client";
import { Player, ChatMessage } from "@/types/api";
import { GraphicsCreator } from "@/components/game/graphics-creator";
import { AnimationManager } from "@/components/game/animation-manager";
import { RoomManager } from "@/components/game/room-manager";
import { OtherPlayersManager } from "@/components/game/other-players-manager";
import { PopupManager } from "@/components/game/popup-manager";
import { SceneSetupManager } from "@/components/game/scene-setup-manager";
import { RoomNavigationManager } from "@/components/game/room-navigation-manager";
import { MapManager } from "@/components/game/map-manager";
import { InteractiveElementsManager } from "@/components/game/interactive-elements-manager";
import { InputManager } from "@/components/game/input-manager";

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
  const [isConnected, setIsConnected] = useState(false);
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);
  const [otherPlayers, setOtherPlayers] = useState<Map<string, Player>>(
    new Map()
  );
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  useEffect(() => {
    const connectToServer = async () => {
      try {
        await gameClient.connect();
        setIsConnected(true);

        const joinResult = await gameClient.joinGame(username);
        setCurrentPlayer(joinResult.player);
        (window as any).currentPlayer = joinResult.player;
        (window as any).pendingExistingPlayers = joinResult.existingPlayers;

        gameClient.onPlayerJoined((newPlayer) => {
          setOtherPlayers((prev) => new Map(prev).set(newPlayer.id, newPlayer));
        });

        gameClient.onPlayerMoved((movedPlayer) => {
          setOtherPlayers((prev) =>
            new Map(prev).set(movedPlayer.id, movedPlayer)
          );
        });

        gameClient.onPlayerDisconnected((playerId) => {
          setOtherPlayers((prev) => {
            const newMap = new Map(prev);
            newMap.delete(playerId);
            return newMap;
          });

          if (phaserGameRef.current) {
            const scene = phaserGameRef.current.scene.getScene(
              "MainScene"
            ) as any;
            if (scene && scene.removePlayer) {
              scene.removePlayer(playerId);
            }
          }
        });

        gameClient.onChatMessage((message) => {
          setChatMessages((prev) => [...prev, message]);
          const chatBox = (window as any).chatBoxInstance;
          if (chatBox && chatBox.addServerMessage) {
            chatBox.addServerMessage(message);
          }
        });

        gameClient.onError((error) => {
          console.error("Game client error:", error);
          if (error.includes("đã tồn tại")) {
            alert("Tên người dùng đã tồn tại. Vui lòng chọn tên khác.");
            window.location.reload();
          }
        });

        gameClient.onGameCompleted((data) => {
          const scene = phaserGameRef.current?.scene.getScene(
            "MainScene"
          ) as any;
          if (scene && scene.showCompletionMessage) {
            scene.showCompletionMessage(data.rank, data.time);
          }
        });

        gameClient.onLeaderboardUpdated((data) => {
          const scene = phaserGameRef.current?.scene.getScene(
            "MainScene"
          ) as any;
          if (scene && scene.updateLeaderboard) {
            scene.updateLeaderboard(data.leaderboard);
          }
        });
      } catch (error) {
        console.error("Connection error:", error);
        if (error instanceof Error && error.message.includes("đã tồn tại")) {
          alert("Tên người dùng đã tồn tại. Vui lòng chọn tên khác.");
          window.location.reload();
        }
      }
    };

    connectToServer();

    const handlePlayerMove = (event: CustomEvent) => {
      const { x, y } = event.detail;
      try {
        gameClient.movePlayer(x, y);
      } catch (error) {
        console.error("Error moving player:", error);
      }
    };

    window.addEventListener("playerMove", handlePlayerMove as EventListener);

    const handleToggleLeaderboard = () => {
      setShowLeaderboard((prev) => !prev);
    };

    window.addEventListener("toggleLeaderboard", handleToggleLeaderboard);

    const handleQuizComplete = () => {
      if (gameClient.isConnected()) {
        gameClient.finishGame();
      }
    };

    window.addEventListener(
      "quizCompleted",
      handleQuizComplete as EventListener
    );

    return () => {
      gameClient.disconnect();
      window.removeEventListener(
        "playerMove",
        handlePlayerMove as EventListener
      );
      window.removeEventListener("toggleLeaderboard", handleToggleLeaderboard);
      window.removeEventListener(
        "quizCompleted",
        handleQuizComplete as EventListener
      );
    };
  }, [username]);

  useEffect(() => {
    if (!gameRef.current || phaserGameRef.current || !PhaserLib) return;

    (window as any).setOtherPlayersFromScene = (
      playersMap: Map<string, Player>
    ) => {
      setOtherPlayers(playersMap);
    };

    const Phaser = PhaserLib as unknown as Phaser;

    class MainScene extends Phaser.Scene {
      private playerMovement!: PlayerMovement;
      private nearExhibit: ExhibitData | null = null;
      private nearLockedDoor: number | null = null;
      private nearPicture: {
        id: number;
        imagePath: string;
        caption: string;
      } | null = null;
      private nearInfoPoint: ExhibitData | null = null;
      private interactKey!: Phaser.Input.Keyboard.Key;
      private finishKey!: Phaser.Input.Keyboard.Key;
      private tabKey!: Phaser.Input.Keyboard.Key;
      private promptText!: Phaser.GameObjects.Text;
      private chatBox!: ChatBox;
      private nearQuizPoint: boolean = false;
      private quizCompleted: boolean = false;
      private currentRoom: number = 1;
      private roomTriggers: { [key: number]: Phaser.Geom.Rectangle } = {};
      private lockedDoors: {
        collision: Phaser.GameObjects.Rectangle;
        roomNumber: number;
      }[] = [];
      private roomBorders: {
        room2Border: Phaser.GameObjects.Rectangle;
        room3Border: Phaser.GameObjects.Rectangle;
      } | null = null;
      private finishLine: {
        collision: Phaser.GameObjects.Rectangle;
        area: Phaser.GameObjects.Rectangle;
        text: Phaser.GameObjects.Text;
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
      private nearFinishLine: boolean = false;
      private completionMessage: Phaser.GameObjects.Text | null = null;
      private leaderboardDisplay: Phaser.GameObjects.Text | null = null;
      private roomsUnlockedByQuiz: Set<number> = new Set();

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

      private infoPoints: {
        exhibit: ExhibitData;
        sprite: Phaser.GameObjects.Sprite;
      }[] = [];
      private quizPoint: {
        collision: Phaser.GameObjects.Rectangle;
        sprite: Phaser.GameObjects.Sprite;
      } | null = null;
      private pictures: {
        collision: Phaser.GameObjects.Rectangle;
        id: number;
        imagePath: string;
        caption: string;
      }[] = [];

      private roomManager!: RoomManager;
      private otherPlayersManager!: OtherPlayersManager;
      private popupManager!: PopupManager;
      private sceneSetupManager!: SceneSetupManager;
      private mapManager!: MapManager;
      private interactiveElementsManager!: InteractiveElementsManager;
      private inputManager!: InputManager;
      private roomNavigationManager!: RoomNavigationManager;

      private currentPopup: {
        overlay?: Phaser.GameObjects.Rectangle;
        bg?: Phaser.GameObjects.Rectangle;
        text?: Phaser.GameObjects.Text;
        button?: Phaser.GameObjects.Rectangle;
        buttonText?: Phaser.GameObjects.Text;
      } | null = null;

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

        GraphicsCreator.createInfoPointGraphic(this);
        GraphicsCreator.createQuizPointGraphic(this);
      }

      create() {
        this.roomManager = new RoomManager(this, unlockedRooms);
        this.otherPlayersManager = new OtherPlayersManager(this, username);
        this.popupManager = new PopupManager(this);
        this.sceneSetupManager = new SceneSetupManager(this);
        this.mapManager = new MapManager(this);
        this.interactiveElementsManager = new InteractiveElementsManager(this);
        this.inputManager = new InputManager(this);

        this.sceneSetupManager.setupPhysicsWorld();
        this.sceneSetupManager.createBaseFloor();
        this.sceneSetupManager.createTitle();

        for (let i = 1; i <= 8; i++) {
          const x = i * 1000;

          this.sceneSetupManager.createWall(x, 250, 40, 460, 0x1e293b);
          this.sceneSetupManager.createWall(x, 950, 40, 460, 0x1e293b);

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
          }
        }

        AnimationManager.createPlayerAnimations(this);

        this.playerMovement = new PlayerMovement(this, username);
        this.roomNavigationManager = new RoomNavigationManager(
          this,
          this.playerMovement
        );

        const startX = playerPositionRef.current?.x || 400;
        const startY = playerPositionRef.current?.y || 400;

        const player = this.playerMovement.createPlayer(startX, startY);

        this.sceneSetupManager.setupCamera(player);

        this.time.delayedCall(100, () => {
          const pendingPlayers = (window as any).pendingExistingPlayers;
          if (pendingPlayers && pendingPlayers.length > 0) {
            const existingPlayersMap = new Map<string, Player>();
            pendingPlayers.forEach((existingPlayer: Player) => {
              existingPlayersMap.set(existingPlayer.id, existingPlayer);
            });

            if ((window as any).setOtherPlayersFromScene) {
              (window as any).setOtherPlayersFromScene(existingPlayersMap);
            }

            (window as any).pendingExistingPlayers = null;
          }
        });

        const { totalWidth, totalHeight } = this.mapManager.createAllMaps();

        this.map = this.mapManager.map;
        this.layer1 = this.mapManager.layer1;
        this.layer2 = this.mapManager.layer2;
        this.layer3 = this.mapManager.layer3;
        this.map2 = this.mapManager.map2;
        this.map2wall = this.mapManager.map2wall;
        this.map2floor = this.mapManager.map2floor;
        this.map3 = this.mapManager.map3;
        this.map3wall = this.mapManager.map3wall;
        this.map3floor1 = this.mapManager.map3floor1;
        this.map3floor2 = this.mapManager.map3floor2;

        this.physics.world.setBounds(0, 0, totalWidth, totalHeight);

        const gamePlayer = this.playerMovement.getPlayer();
        if (gamePlayer) {
          this.sceneSetupManager.updateCameraBounds(
            totalWidth,
            totalHeight,
            gamePlayer
          );
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

        this.interactiveElementsManager.createInfoPoints();
        this.interactiveElementsManager.createPictures();
        this.roomBorders = this.roomManager.createRoomBorders(
          this.map,
          this.map2
        );
        this.interactiveElementsManager.createComprehensiveQuizPoint();

        this.infoPoints = this.interactiveElementsManager.infoPoints;
        this.quizPoint = this.interactiveElementsManager.quizPoint;
        this.pictures = this.interactiveElementsManager.pictures;

        if (this.roomBorders && this.roomBorders.room2Border) {
          this.physics.add.collider(player, this.roomBorders.room2Border);
        }
        if (this.roomBorders && this.roomBorders.room3Border) {
          this.physics.add.collider(player, this.roomBorders.room3Border);
        }

        this.roomTriggers = this.roomManager.createRoomTriggers();

        this.interactKey = this.input.keyboard!.addKey(
          Phaser.Input.Keyboard.KeyCodes.E
        );

        this.finishKey = this.input.keyboard!.addKey(
          Phaser.Input.Keyboard.KeyCodes.F
        );

        this.finishKey.on("down", () => {
          if (this.nearFinishLine) {
            this.popupManager.showFinalCompletionPopup();
          }
        });

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
          if (this.nearQuizPoint && !this.quizCompleted) {
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

        this.tabKey = this.input.keyboard!.addKey(
          Phaser.Input.Keyboard.KeyCodes.TAB
        );

        this.tabKey.on("down", () => {
          const currentPlayer = (window as any).currentPlayer;
          if (currentPlayer && currentPlayer.username === "admin1234509876") {
            window.dispatchEvent(new Event("toggleLeaderboard"));
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

      showPictureModal(imagePath: string, caption: string) {
        this.scene.pause();

        (window as any).showPictureModal?.(imagePath, caption);
      }

      refreshBackButtons() {
        this.roomNavigationManager.refreshBackButtons();
        this.backButtons = this.roomNavigationManager.getBackButtons();
        this.goToRoomButtons = this.roomNavigationManager.getGoToRoomButtons();
      }

      unlockRoom(roomNumber: number) {
        // Check if room is already unlocked to prevent duplicate teleporting
        if (this.roomsUnlockedByQuiz.has(roomNumber)) {
          console.log(`Room ${roomNumber} already unlocked, skipping teleport`);
          return;
        }

        this.roomsUnlockedByQuiz.add(roomNumber);

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

          // Send position to server
          if ((window as any).gameClient && (window as any).currentPlayer) {
            (window as any).gameClient.movePlayer(targetPos.x, targetPos.y);
          }
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

        if (this.time.now % 5000 < 16) {
          this.otherPlayersManager.cleanupCorruptedSprites();
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
        if (this.quizPoint && !this.quizCompleted) {
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

        this.nearFinishLine = false;
        if (this.finishLine) {
          const distance = Phaser.Math.Distance.Between(
            player.x,
            player.y,
            this.finishLine.collision.x,
            this.finishLine.collision.y
          );
          if (distance < 100) {
            this.nearFinishLine = true;
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

        if (this.nearQuizPoint && !this.quizCompleted) {
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
        } else if (this.nearFinishLine) {
          this.promptText.setText("Nhấn F để hoàn thành trò chơi!");
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

      createChat() {
        this.chatBox = new ChatBox(this, username, (enabled: boolean) => {
          this.playerMovement.setMovementEnabled(enabled);
        });
        this.chatBox.create();
        (window as any).chatBoxInstance = this.chatBox;
      }

      updateOtherPlayers(players: Map<string, Player>) {
        this.otherPlayersManager.updateOtherPlayers(players);
      }

      removePlayer(playerId: string) {
        this.otherPlayersManager.removePlayer(playerId);
      }

      showCompletionMessage(rank: number, time: string) {
        if (this.completionMessage) {
          this.completionMessage.destroy();
        }

        const medals = ["🥇", "🥈", "🥉"];
        const medal = rank <= 3 ? medals[rank - 1] : `#${rank}`;

        this.completionMessage = this.add
          .text(
            (this.sys.game.config.width as number) / 2,
            100,
            `${medal} Hoàn thành!\nThứ hạng: ${rank}\nThời gian: ${time}`,
            {
              fontSize: "24px",
              color: "#00ff00",
              fontStyle: "bold",
              align: "center",
              backgroundColor: "#000000",
              padding: { x: 15, y: 10 },
            }
          )
          .setOrigin(0.5)
          .setScrollFactor(0)
          .setDepth(200);

        this.time.delayedCall(5000, () => {
          if (this.completionMessage) {
            this.completionMessage.destroy();
            this.completionMessage = null;
          }
        });
      }

      updateLeaderboard(leaderboard: any[]) {
        if (this.leaderboardDisplay) {
          this.leaderboardDisplay.destroy();
        }

        const top5 = leaderboard.slice(0, 5);
        let displayText = "🏆 TOP 5 LEADERBOARD 🏆\n\n";

        top5.forEach((entry, index) => {
          const medals = ["🥇", "🥈", "🥉", "4️⃣", "5️⃣"];
          displayText += `${medals[index]} ${entry.username}: ${entry.completionTime}\n`;
        });

        this.leaderboardDisplay = this.add
          .text((this.sys.game.config.width as number) - 20, 20, displayText, {
            fontSize: "14px",
            color: "#ffffff",
            backgroundColor: "#000000aa",
            padding: { x: 10, y: 8 },
            align: "left",
          })
          .setOrigin(1, 0)
          .setScrollFactor(0)
          .setDepth(150);
      }

      showGamePopup(
        title: string,
        message: string,
        buttonText: string = "OK",
        onClose?: () => void
      ) {
        this.popupManager.showGamePopup(title, message, buttonText, onClose);
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
    (window as any).gameClient = gameClient;
    (window as any).currentPlayer = currentPlayer;
    (window as any).unlockedRooms = unlockedRooms;
    (window as any).unlockRoom = (roomNumber: number) => {
      const scene = game.scene.getScene("MainScene") as MainScene;
      if (scene && scene.unlockRoom) {
        scene.unlockRoom(roomNumber);
      }
    };

    (window as any).createFinishLine = () => {
      const scene = game.scene.getScene("MainScene") as any;
      if (scene && scene.interactiveElementsManager) {
        scene.interactiveElementsManager.createFinishLine(scene.mapManager);
        scene.finishLine = scene.interactiveElementsManager.finishLine;
      }
    };

    (window as any).showGamePopup = (
      title: string,
      message: string,
      buttonText?: string,
      onClose?: () => void
    ) => {
      const scene = game.scene.getScene("MainScene") as any;
      if (scene && scene.showGamePopup) {
        scene.showGamePopup(title, message, buttonText || "OK", onClose);
      } else {
        console.warn("Scene not ready for popup:", title);
        setTimeout(() => {
          const retryScene = game.scene.getScene("MainScene") as any;
          if (retryScene && retryScene.showGamePopup) {
            retryScene.showGamePopup(
              title,
              message,
              buttonText || "OK",
              onClose
            );
          }
        }, 100);
      }
    };

    return () => {
      game.destroy(true);
      phaserGameRef.current = null;
      (window as any).setOtherPlayersFromScene = null;
      (window as any).pendingExistingPlayers = null;
    };
  }, [
    onExhibitInteract,
    onDoorInteract,
    visitedExhibits,
    unlockedRooms,
    username,
  ]);

  useEffect(() => {
    if (phaserGameRef.current && otherPlayers.size > 0) {
      const scene = phaserGameRef.current.scene.getScene("MainScene") as any;
      if (scene && scene.updateOtherPlayers) {
        scene.updateOtherPlayers(otherPlayers);
      }
    }
  }, [otherPlayers]);

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
      {currentPlayer?.username === "admin1234509876" && (
        <LeaderboardModal
          isOpen={showLeaderboard}
          onClose={() => setShowLeaderboard(false)}
        />
      )}
    </>
  );
}
