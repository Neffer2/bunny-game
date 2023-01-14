let rabbit;
let possibleMoves = [524, 524, 472, 435, 385, 315, 265, 210, 165, 105, 65];
let moveCounter = 0;
let canGoUp = true;
let canGoDown = true;
let carrots;
let score;
let scoreTable;
let countdown = 60;
let countdownText;
let countdownTable;
let LeftVehicles;
let RightVehicles;
let LeftLimit;
let RightLimit;
let LeftCarriles = [485, 165];
let RightCarriles = [385, 265];
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
        this.load.image('carrot', './assets/img/carrot.png');
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

        /* Rabbit */
            rabbit = this.physics.add.sprite(200, 576, 'rabbit', 24);
            rabbit.setSize(20, 20, true);
            rabbit.score = 0;
        /*  */

        /* Carrots */
            carrots = this.physics.add.group();
            carrots.create(200, 65, 'carrot').setScale(.5);
        /*  */

        /* Score */
            scoreTable = this.add.graphics();
            scoreTable.fillStyle(0x0000ff, 1);
            //  32px radius on the corners
            scoreTable.fillRoundedRect(145, 601, 100, 50, 8);

            score = this.add.text(190, 615, rabbit.score ,{
                fontFamily: 'Consolas, Georgia, "Goudy Bookletter 1911", Times, serif',
                fontSize: 24, 
                color: 'white'
            });
        /*  */

        /* countdown */
            countdownTable = this.add.graphics();
            countdownTable.fillStyle(0x0000, 1);
            //  32px radius on the corners
            countdownTable.fillRoundedRect(345, 605, 90, 40, 1);

            countdownText = this.add.text(355, 615, "00:"+countdown ,{
                font: '24px Courier',
                fill: '#00ff00'
            });
        /* */

        const Interval = setInterval(() => {
            countdown--;
            if (countdown > 9){
                countdownText.setText("00:"+countdown);
            }else {
                countdownText.setText("00:0"+countdown);
            }

            if (countdown <= 0){
                clearInterval(Interval);
                this.time.addEvent({
                    delay: 500,
                    loop: false,
                    callback: () => {
                        alert('Juego terminado');
                        // this.scene.start("endScene");
                    } 
                });    
            }
        }, 1000);

        /* Cars */
            LeftVehicles = this.physics.add.group();
            RightVehicles = this.physics.add.group();
            LeftVehicles.create(-100, LeftCarriles[0], 'cars', this.getCars(0 ,9)).setVelocityX(this.getVelocity()).setSize(135, 60, false);
            LeftVehicles.create(-100, LeftCarriles[1], 'cars2', this.getCars(0 ,24)).setVelocityX(this.getVelocity()).setSize(135, 60, true);

            
            RightVehicles.create(900, RightCarriles[0], 'motorcycles', this.getCars(0 ,3)).setVelocityX(-this.getVelocity()).setSize(135, 60, false).flipX = true;
            RightVehicles.create(900, RightCarriles[1], 'cars2', this.getCars(0 ,24)).setVelocityX(-this.getVelocity()).setSize(135, 60, true).flipX = true;
        /*  */

        /* Limits */
            LeftLimit = this.add.rectangle(-30, 340, 50, 680, 0x0000);
            RightLimit = this.add.rectangle(800, 340, 50, 680, 0x0000);

            this.physics.add.existing(LeftLimit);
            this.physics.add.existing(RightLimit);
            
            LeftLimit.body.setImmovable(true);
            RightLimit.body.setImmovable(true);
        /* */
            
        /* Animations */
        this.anims.create({
            key: 'Up',
            frames: this.anims.generateFrameNumbers('rabbit', {start: 25, end: 32}),
            framerate: 8,
            repeat: 0
        });

        this.anims.create({
            key: 'Down',
            frames: this.anims.generateFrameNumbers('rabbit', {start: 8, end: 15}),
            framerate: 8,
            repeat: 0
        });
        /* --- */

        /* Colitions */
            this.physics.add.overlap(rabbit, carrots, rabbitCollecRabit, null, this);

            this.physics.add.collider(RightLimit, LeftVehicles, this.LeftVehicleLimit, null, this);
            this.physics.add.overlap(LeftLimit, RightVehicles, this.RightVehicleLimit, null, this);
        /*  */

        /** functions */
            function rabbitCollecRabit(rabbit, carrots) {
                score.setText(rabbit.score++);
                console.log(rabbit.score);
                carrots.disableBody(true, true);
                // Enable in random position
                let y = Math.floor(Math.random() * possibleMoves.length + 1);
                    // Reset, x, y, physics, visible
                carrots.enableBody(true, 200, possibleMoves[y], true, true);
            }
        /** */
    }

    getVelocity(){
        let min = 160;
        let max = 300;
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    getCars(min, max){
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    getCarriles(){
        let min = 0;
        let max = 1;
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    LeftVehicleLimit(limit, elem){
        elem.destroy();
        let currentCar = LeftVehicles.create(-100, LeftCarriles[this.getCarriles()], 'cars', this.getCars(0 ,9)).setVelocityX(this.getVelocity()).setSize(135, 60, false);
    }

    RightVehicleLimit(limit, elem){
        elem.destroy();
        let currentCar = RightVehicles.create(900, RightCarriles[this.getCarriles()], 'cars2', this.getCars(0 ,24)).setVelocityX(-this.getVelocity()).setSize(135, 60, true).flipX = true;
    }

    update(){
        let scanner = this.input.keyboard.createCursorKeys();
        /* Evita que el movimento se haga muy rapido */
        if (scanner.up.isUp) {
            canGoUp = true;
        }

        if (scanner.down.isUp){
            canGoDown = true;
        }

        function getNextMove(nextMove, direction){
            // 1 = Up, -1 = Down
            if (direction > 0){
                if (nextMove+1 < possibleMoves.length){
                    moveCounter++;
                    return possibleMoves[moveCounter];
                }else {
                    return possibleMoves[nextMove];
                }
            }else if (direction < 0){
                if (nextMove-1 < possibleMoves.length && nextMove-1 >= 0){
                    moveCounter--;
                    return possibleMoves[moveCounter];
                }else {
                    return possibleMoves[nextMove];
                }
            }
        }

        if (scanner.up.isDown){
            rabbit.anims.play('Up', false);
            if (canGoUp){
                canGoUp = false;
                rabbit.y = getNextMove(moveCounter,1);
            }
        }else if (scanner.down.isDown){
            rabbit.anims.play('Down', false);
            if (canGoDown){
                canGoDown = false;
                rabbit.y = getNextMove(moveCounter, -1);
            }
        }
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
            // gravity: { y: 350 }
        }
    }
}

// Inicializacion del objeto
game = new Phaser.Game(config)