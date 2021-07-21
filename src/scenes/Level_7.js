class Level_7 extends Phaser.Scene {
    constructor() {
        super("Level_7");
    }

    preload() {
        this.load.image('player', './assets/walker.png');
        this.load.image('background7', './assets/background7-01.png');
        this.load.image('ground', './assets/ground.png');
        this.load.spritesheet('walking', './assets/walker7Frames-01.png', {frameWidth: 110, frameHeight: 187, startFrame: 0, endFrame: 7});
        this.load.image('breathe', './assets/breathe_button.png');
        this.load.spritesheet('rhythm', './assets/outer_ring.png', {frameWidth: 298, frameHeight: 400, startFrame: 0, endFrame: 7});
        this.load.audio('inhale', 'assets/inhale.wav');
        this.load.audio('exhale', 'assets/exhale.wav');
        }

    create() {
        this.key0 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ZERO);
        this.key1 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ONE);
        this.key2 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.TWO);
        this.key3 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.THREE);
        this.key4 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.FOUR);
        this.key5 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.FIVE);
        this.key6 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SIX);
        this.key7 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SEVEN);
        this.key8 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.EIGHT);
        this.key9 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.NINE);

        this.add.sprite(0, 0, 'background7').setOrigin(0, 0);
        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        //this.add.sprite(0, 475, 'ground').setOrigin(0);

        this.walker = this.physics.add.sprite(game.config.height/4, game.config.width/3.5, 'player').setOrigin(0, 0);
        // Circle that contricts and expands around the button
        this.innout = this.physics.add.sprite((game.config.width/2), (game.config.height/3), 'rhythm');
        this.innout.circleSize = 1.1;
        // breathe button
        this.breathe = this.physics.add.sprite((game.config.width/2), (game.config.height/3), 'breathe');

        /* NO NEED SINCE WE NO LONGER USE THE ANIMATION */
        // collison box of innout size
        //this.innout.setSize(200, 200, (-20, -1.25));
        //button animation config
        // this.buttonAnimConfig = {
        //     key: 'in-n-out',
        //     frames: this.anims.generateFrameNumbers('rhythm', { start: 0, end: 6, first: 0}),
        //     frameRate: 10,
        //     repeat: -1
        // };
        //this.anims.create(this.buttonAnimConfig);
        //this.innout.anims.play('in-n-out');
        /**********************************************/

        // walking animation config
        this.walkingAnim = {
            key: 'walk',
            frames:  this.anims.generateFrameNumbers('walking', { start: 0, end: 6, first: 0}),
            frameRate: 15
        };
        this.anims.create(this.walkingAnim);

        this.walker.body.velocity.x = 0;
        
        //inhale/exhale variable
        this.breatheCount = 0;
        // variable to exapnd/shrink ruthm overlay, if true then shrink, if false then expand.
        this.isDecreasing = true; 
        // variable to know if spacebar has been pressed, used to go to end screen if a beat was missed.
        this.wasPressed = true;  // starts true so player doesn't lose at first beat.

        game.speed = 0.011;
        game.currLvl = 6;
    }

    update() {

        // update the rhythm circle size by changing its scale.
        this.setCircleSize(); 

        // checks if walking animation is playing, if not,
        // then it sets x-velocity of all objects to 0
        if (!(this.walker.anims.isPlaying)) {// && this.walker.anims.currentAnim.key === 'walk')) {
            this.walker.body.velocity.x = 0;
            this.walker.body.velocity.y = 0;
        }
        
        /* 
        checks if space button was pressed and also if walking is not playing,
        if true, then set velocity of all objects to 500 and plays walking animation.
        */
        if ((Phaser.Input.Keyboard.JustDown(this.spaceKey)) 
        && (!(this.walker.anims.isPlaying))) { 
            //&& this.walker.anims.currentAnim.key === 'walk'))) {
                 // for harsha: no need to check frame since we check if animation is playing anyway

            this.wasPressed = true; // we hit spacebar.

            // was spacebar pressed at the correct time?
            if (this.innout.displayWidth <= this.breathe.displayWidth) { // checks size of the rhythm circle and the breathe button.
                this.walker.body.velocity.x = 500;
                this.walker.body.velocity.y = -100; // goes in diag.

                this.walker.anims.play('walk');

                this.playInhaleExhale(); // play audio.

            } else { // if it wasn't hit at the right time you lose.
                this.scene.start('Level_8');
            }
        }

        // also lose if you don't hit spacebar in time
        if (!this.isDecreasing &&                                    // if the cricle is growing
            !this.wasPressed &&                                      // and we haven't hit the spacebar
            this.innout.displayWidth > this.breathe.displayWidth) {  // by the time it gets bigger than the button
                //this.scene.start('GameOverScene');                   // you lose
                this.scene.restart();
        }
        
        // if player reaches end of screen, then transitions to next scene
        if (this.walker.x > game.config.width) {
            this.scene.start("Level_8");
        }

        if (Phaser.Input.Keyboard.JustDown(this.key1)) {
            this.scene.start("Level_1");
        }
        if (Phaser.Input.Keyboard.JustDown(this.key2)) {
            this.scene.start("Level_2");
        }
        if (Phaser.Input.Keyboard.JustDown(this.key3)) {
            this.scene.start("Level_3");
        }
        if (Phaser.Input.Keyboard.JustDown(this.key4)) {
            this.scene.start("Level_4");
        }
        if (Phaser.Input.Keyboard.JustDown(this.key5)) {
            this.scene.start("Level_5");
        }
        if (Phaser.Input.Keyboard.JustDown(this.key6)) {
            this.scene.start("Level_6");
        }
        if (Phaser.Input.Keyboard.JustDown(this.key7)) {
            this.scene.start("Level_7");
        }
        if (Phaser.Input.Keyboard.JustDown(this.key8)) {
            this.scene.start("Level_8");
        }
    }

    playInhaleExhale() {
        if ((this.breatheCount % 2) == 0) {
            this.sound.play('inhale');
            
        } else if ((this.breatheCount % 2) == 1) {
            this.sound.play('exhale');
            
        }
        this.breatheCount += 1;
    }

    setCircleSize() {

        this.innout.setScale(this.innout.circleSize); // update the scale.
        // if we are decreasing,
        if (this.isDecreasing) {
            this.innout.circleSize -= game.speed; // shrink the circle

            if (this.innout.displayWidth <= this.breathe.displayWidth - 20) {
                this.isDecreasing = false; // and if we reached the breathe button (and some for some leaway), we are no longer decreasing
                game.speed += 0.0008;
                console.log(game.speed);
            }
            
        } else { // if we are not decreasing,
            this.innout.circleSize += game.speed; // expand the circle

            if (this.innout.circleSize >= 1.1) { // until it reaches the desired size. 
                this.isDecreasing = true;        // and we start decreasing again.
                this.wasPressed = false;         // we can reset wether we hit/pressed spacebar last time
            }
        }
    }
}