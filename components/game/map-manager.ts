export class MapManager {
  private scene: Phaser.Scene;
  
  public map!: Phaser.Tilemaps.Tilemap;
  public layer1!: Phaser.Tilemaps.TilemapLayer;
  public layer2!: Phaser.Tilemaps.TilemapLayer;
  public layer3!: Phaser.Tilemaps.TilemapLayer;
  public map2!: Phaser.Tilemaps.Tilemap;
  public map2wall!: Phaser.Tilemaps.TilemapLayer;
  public map2floor!: Phaser.Tilemaps.TilemapLayer;
  public map3!: Phaser.Tilemaps.Tilemap;
  public map3wall!: Phaser.Tilemaps.TilemapLayer;
  public map3floor1!: Phaser.Tilemaps.TilemapLayer;
  public map3floor2!: Phaser.Tilemaps.TilemapLayer;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  createAllMaps() {
    this.createMap1();
    this.createMap2();
    this.createMap3();
    return this.getTotalDimensions();
  }

  private createMap1() {
    this.map = this.scene.make.tilemap({ key: "map1" });
    const tileset1 = this.map.addTilesetImage("room", "room")!;
    const tileset2 = this.map.addTilesetImage("interior", "interior")!;

    this.layer1 = this.map.createLayer("layer1", [tileset1, tileset2], 0, 0)!;
    this.layer2 = this.map.createLayer("layer2", [tileset1, tileset2], 0, 0)!;
    this.layer3 = this.map.createLayer("layer3", [tileset1, tileset2], 0, 0)!;

    this.layer1.setVisible(true);
    this.layer2.setVisible(true);
    this.layer3.setVisible(true);

    this.layer3.setDepth(0);
    this.layer2.setDepth(1);
    this.layer1.setDepth(2);
  }

  private createMap2() {
    this.map2 = this.scene.make.tilemap({ key: "map2" });
    const map2tileset = this.map2.addTilesetImage("Dungeon_Tileset", "Dungeon_Tileset")!;

    this.map2floor = this.map2.createLayer("Floor0", [map2tileset], this.map.widthInPixels, 0)!;
    this.map2wall = this.map2.createLayer("Floor1", [map2tileset], this.map.widthInPixels, 0)!;

    this.map2floor.setVisible(true);
    this.map2wall.setVisible(true);
    this.map2floor.setDepth(3);
    this.map2wall.setDepth(4);

    this.createMap2Title();
  }

  private createMap3() {
    this.map3 = this.scene.make.tilemap({ key: "map3" });
    const map3tileset = this.map3.addTilesetImage("antarcticbees_interior_free_sample-export", "antarcticbees_interior")!;
    const map3OffsetX = this.map.widthInPixels + this.map2.widthInPixels;

    this.map3floor1 = this.map3.createLayer("floor1", [map3tileset], map3OffsetX, 0)!;
    this.map3floor2 = this.map3.createLayer("floor2", [map3tileset], map3OffsetX, 0)!;
    this.map3wall = this.map3.createLayer("wall", [map3tileset], map3OffsetX, 0)!;

    this.map3floor1.setVisible(true);
    this.map3floor2.setVisible(true);
    this.map3wall.setVisible(true);
    this.map3floor1.setDepth(5);
    this.map3floor2.setDepth(6);
    this.map3wall.setDepth(7);

    this.createMap3Title();
  }

  private createMap2Title() {
    this.scene.add.rectangle(720 + this.map.widthInPixels, 100, 600, 60, 0x0f3460);
    this.scene.add
      .text(720 + this.map.widthInPixels, 100, "PHÒNG 2: BẢN CHẤT & HÌNH THỨC", {
        fontSize: "24px",
        color: "#e8e8e8",
        fontStyle: "bold",
      })
      .setOrigin(0.5)
      .setDepth(10);
  }

  private createMap3Title() {
    this.scene.add.rectangle(720 + this.map.widthInPixels + this.map2.widthInPixels, 100, 600, 60, 0x0f3460);
    this.scene.add
      .text(720 + this.map.widthInPixels + this.map2.widthInPixels, 100, "PHÒNG 3: NGHIÊN CỨU KHOA HỌC", {
        fontSize: "24px",
        color: "#e8e8e8",
        fontStyle: "bold",
      })
      .setOrigin(0.5)
      .setDepth(10);
  }

  getTotalDimensions() {
    const totalWidth = this.map.widthInPixels + this.map2.widthInPixels + this.map3.widthInPixels;
    const totalHeight = Math.max(this.map.heightInPixels, this.map2.heightInPixels, this.map3.heightInPixels);
    return { totalWidth, totalHeight };
  }

  getMap3OffsetX() {
    return this.map.widthInPixels + this.map2.widthInPixels;
  }
}