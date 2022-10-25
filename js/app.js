
class MainScene extends Phaser.Scene {
    constructor(){
        super('gameScene');
    } 

    preload(){
        /* Tilemap */
            this.load.image('gameTiles', './assets/img/tilemap.png');  
            this.load.tilemapTiledJSON('tilemap', './assets/img/tilemap-bunnygame.json');
        /* --- */
        
        //NOTA: Para sacar el frameWidth y el frameHeight se divide el tamaño de la imagen sobre el numero de obj
        this.load.spritesheet('cars', './assets/img/cars.png', {frameWidth: 140, frameHeight: 70});
        this.load.spritesheet('cars2', './assets/img/cars2.png', {frameWidth: 150, frameHeight: 90});
        this.load.spritesheet('bigvehicles', './assets/img/bigvehicles.png', {frameWidth: 250, frameHeight: 100.25});
        this.load.spritesheet('motorcycles', './assets/img/motorcycle.png', {frameWidth: 158, frameHeight: 62.5});
        this.load.spritesheet('rabbit', './assets/img/rabbits.png', {frameWidth: 40, frameHeight: 40});
    }
 
    create(){
        // Añadiendo el TileMap 
        /*
            Se crea la constante map que inicia un tilemap
            Se asocia la imagen con el JSON (Tilemap es el nombre que está dentro del JSON)
            Se imprimen las capas
        */
        const map = this.add.tilemap('tilemap');
        const tileset = map.addTilesetImage('Tilemap', 'gameTiles');
        map.createLayer('Grass', tileset);
        map.createLayer('YellowLine', tileset);
        map.createLayer('GrayRace', tileset);
        map.createLayer('WhiteLine', tileset);
    }

    update(){
    }
}

// Configuracion general
const config = {
    // Phaser.AUTO, intenta usa WebGL y si el navegador no lo tiene, usa canva.
    type: Phaser.AUTO,
    parent: 'game-container',
    width: 768,
    height: 672,
    scene: [MainScene],
    scale: {
        // mode: Phaser.Scale.FIT
    },
    physics: {
        default: 'arcade',
        arcade: {
            debug: true,
            gravity: { y: 350 }
        }
    }
}

// Inicializacion del objeto
game = new Phaser.Game(config)