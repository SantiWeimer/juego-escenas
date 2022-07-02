// Clase Preloads, para separar los preloads y tener mejor orden
export class Preloads extends Phaser.Scene {
  // Se extiende de Phaser.Scene porque es una escena
  constructor() {
    // Se asigna una key para despues poder llamar a la escena
    super("Preloads");
  }

  preload() {
    this.load.image("sad_cow", "public/assets/images/sad_cow.png");
    this.load.image("phaser_logo", "public/assets/images/phaser_logo.png");
    this.load.image("mainmenu_bg","public/assets/images/main_menu_background.png");

    //fondo
    this.load.image("sky", "public/assets/images/sky.png");
    this.load.image("star", "public/assets/images/star.png");
    
    this.load.spritesheet("dude", "public/assets/images/dude.png", {frameWidth: 32, frameHeight: 48 });

    //tilemap
    this.load.tilemapTiledJSON("map1", "/assets/tilemap/tilemap1.json");
        
    //plataformas
    this.load.image("base", "public/assets/images/base.png");
    this.load.image("plataforma", "public/assets/images/plataforma.png");
    this.load.image("plataforma2", "public/assets/images/plataforma2.png");
    this.load.image("plataforma3", "public/assets/images/plataforma3.png");

    //objetos
    this.load.image("anillo", "public/assets/images/anillo.png");
    this.load.image("moneda", "public/assets/images/moneda.png");
    this.load.image("bomb", "public/assets/images/bomb.png");

    this.load.audio('sonidomusica', 'public/assets/sounds/musica.mp3');
  }

  create() {
    //  Our player animations, turning, walking left and walking right.
    this.anims.create({
      key: "left",
      frames: this.anims.generateFrameNumbers("dude", { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "turn",
      frames: [{ key: "dude", frame: 4 }],
      frameRate: 20,
    });

    this.anims.create({
      key: "right",
      frames: this.anims.generateFrameNumbers("dude", { start: 5, end: 8 }),
      frameRate: 10,
      repeat: -1,
    });

    // Pasa directamente a la escena del menú principal
    this.scene.start("MainMenu");
  }
}
