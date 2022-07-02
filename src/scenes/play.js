// Declaracion de variables para esta escena
var player;
var stars;
var anillo;
var bombs;
var cursors;
var score;
var gameOver;
var scoreText;

var sonidomusica;
var sonidomoneda;

// Clase Play, donde se crean todos los sprites, el escenario del juego y se inicializa y actualiza toda la logica del juego.
export class Play extends Phaser.Scene {
  constructor() {
    // Se asigna una key para despues poder llamar a la escena
    super("Play");
  }

  preload() {
    this.load.tilemapTiledJSON("map", "public/assets/tilemaps/map.json");
    this.load.image("tilesBelow", "public/assets/images/sky_atlas.png");
    this.load.image("tilesPlatform", "public/assets/images/platforma.png");
    this.load.image("tilesPlatform2", "public/assets/images/platforma2.png");
    this.load.image("tilesPlatform3", "public/assets/images/platforma3.png");
    this.load.image("tilesBase", "public/assets/images/base.png");

  
  }

  init(data) {
    // recupera el valor SCORE enviado como dato al inicio de la escena
    score = data.score;
  }

  create() {

    

    //tilemap
    const map = this.make.tilemap({ key: "map" });

  
    const tilesetBelow = map.addTilesetImage("sky_atlas", "tilesBelow");
    const tilesetPlatform = map.addTilesetImage("platforma","tilesPlatform");
    const tilesetPlatform2 = map.addTilesetImage("platforma2","tilesPlatform");
    const tilesetPlatform3 = map.addTilesetImage("platforma3","tilesPlatform");
    const tilesetBase = map.addTilesetImage("base","tilesBase");

    // Parameters: layer name (or index) from Tiled, tileset, x, y
    const belowLayer = map.createLayer("Fondo", tilesetBelow, 0, 0);
    const worldLayer = map.createLayer("Plataformas", tilesetPlatform, 0, 0);
    const worldLayer2 = map.createLayer("Plataformas2", tilesetPlatform2, 0, 0);
    const worldLayer3 = map.createLayer("Plataformas3", tilesetPlatform3, 0, 0);

    const objectsLayer = map.getObjectLayer("Objetos");

    worldLayer.setCollisionByProperty({ collides: true });


    //plataformas

    var platforms = this.physics.add.staticGroup();

  
    platforms.create(400, 568, 'base').setScale(2).refreshBody();
 
    platforms.create(70, 440, 'plataforma2');
    platforms.create(700, 450, 'plataforma');
 
     
    platforms.create(340, 320, 'plataforma2');
    platforms.create(610, 300, 'plataforma3');
 
 
    platforms.create(500, 130, 'plataforma3');
     
    platforms.create(30, 220, 'plataforma3');
    platforms.create(850, 200, 'plataforma2');
 
    platforms.create(30, 100, 'plataforma3');


    //personaje
    const spawnPoint = map.findObject("Objetos", (obj) => obj.name === "dude");
  
    player = this.physics.add.sprite(spawnPoint.x, spawnPoint.y, "dude");

    player.setBounce(0.2);
    player.setCollideWorldBounds(true);

   //teclado
    if ((cursors = !undefined)) {
      cursors = this.input.keyboard.createCursorKeys();
    }

    
   //monedas
    stars = this.physics.add.group({
    key: 'moneda',
    repeat: 10,
    setXY: { x: 100, y: 0, stepX: 68 }
    } );

    stars.children.iterate(function (child) {

    
    child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));

    });

    //anillo
    anillo = this.physics.add.group({
    key: 'anillo',
    repeat: 0,
    setXY: { x: 50, y: 0, }
    } );
    

    
    bombs = this.physics.add.group();
    
    var x =
        player.x < 400
          ? Phaser.Math.Between(400, 800)
          : Phaser.Math.Between(0, 400);

      var bomb = bombs.create(x, 16, "bomb");
      bomb.setBounce(1);
      bomb.setCollideWorldBounds(true);
      bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);

      var bomb2 = bombs.create(x, 16, "bomb");
      bomb2.setBounce(1);
      bomb2.setCollideWorldBounds(true);
      bomb2.setVelocity(Phaser.Math.Between(-200, 200), 20);
      
    
    scoreText = this.add.text(560, 16, 'Puntos: 0', { fontFamily: 'Times', fontStyle: 'italic', fontSize: '32px', fill: '#D9120C' });
    var nivelText = this.add.text(16, 16, 'Nivel: 2', { fontFamily: 'Times', fontStyle: 'italic', fontSize: '32px', fill: '#D9120C' });

    //colisiones
    
    this.physics.add.collider(player, platforms);
    this.physics.add.collider(anillo, platforms);
    this.physics.add.collider(stars, platforms);
    this.physics.add.collider(bombs, platforms);

   
    this.physics.add.overlap(player, stars, this.collectStar, null, this);
    this.physics.add.overlap(player, anillo, this.collectAnillo, null, this);
    this.physics.add.collider(player, bombs, this.hitBomb, null, this);

    gameOver = false;
    score = 0;


  }

  update() {
    if (gameOver) {
      return;
    }

    if (cursors.left.isDown) {
      player.setVelocityX(-160);

      player.anims.play("left", true);
    } else if (cursors.right.isDown) {
      player.setVelocityX(160);

      player.anims.play("right", true);
    } else {
      player.setVelocityX(0);

      player.anims.play("turn");
    }

    
    if (cursors.up.isDown && player.body.blocked.down) {
      player.setVelocityY(-330);
    }
  }

  collectStar(player, star) {
    star.disableBody(true, true);
   

    
    score += 10;
    scoreText.setText("Score: " + score);

    if (stars.countActive(true) === 0) {
      
      this.scene.start("Retry", { score: score });

     
    }
  }

  collectAnillo(player, star) {
    star.disableBody(true, true);
   

    
    score += 50;
    scoreText.setText("Score: " + score);

    
  }

  
  hitBomb(player, bomb) {
    this.physics.pause();

    player.setTint(0xff0000);

    player.anims.play("turn");

    gameOver = true;

    
    setTimeout(() => {
     
      this.scene.start(
        "Retry",
        { score: score } // se pasa el puntaje como dato a la escena RETRY
      );
    }, 1000); 
  }
}
