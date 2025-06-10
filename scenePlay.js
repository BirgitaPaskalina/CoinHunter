var scenePlay = new Phaser.Class({
    Extends: Phaser.Scene,

    initialize: function () {
        Phaser.Scene.call(this, { key: 'scenePlay' });

    },

    preload: function () {
        this.load.setBaseURL('assets/');
        this.load.image("background", 'images/BG.png');
        this.load.image("btn_play", "images/ButtonPlay.png");
        this.load.image("gameover", "images/GameOver.png");
        this.load.image("coin", "images/Koin.png");
        this.load.image("enemy1", "images/Musuh01.png");
        this.load.image("enemy2", "images/Musuh02.png");
        this.load.image("enemy3", "images/Musuh03.png");
        this.load.image("coin_panel", "images/PanelCoin.png");
        this.load.image("ground", "images/Tile50.png");
        this.load.audio("snd_coin", "audio/koin.mp3");
        this.load.audio("snd_lose", "audio/kalah.mp3");
        this.load.audio("snd_jump", "audio/lompat.mp3");
        this.load.audio("snd_leveling", "audio/ganti_level.mp3");
        this.load.audio("snd_walk", "audio/jalan.mp3");
        this.load.audio("snd_touch", "audio/touch.mp3");
        this.load.audio("music_play", "audio/music_play.mp3");
        this.load.spritesheet("char", "images/CharaSpriteAnim.png", { frameWidth: 44.8, frameHeight: 93 });
    },

    create: function () {
        const layoutSize = { w: 1024, h: 768 };
        const X_POSITION = {
            LEFT: 0,
            CENTER: this.sys.game.canvas.width / 2,
            RIGHT: this.sys.game.canvas.width
        };
        const Y_POSITION = {
            TOP: 0,
            CENTER: this.sys.game.canvas.height / 2,
            BOTTOM: this.sys.game.canvas.height
        };
        const relativeSize = {
            w: (this.sys.game.canvas.width - layoutSize.w) / 2,
            h: (this.sys.game.canvas.height - layoutSize.h) / 2
        };

        this.countCoin = 0;
        this.currentLevel = 1;
        this.gameStarted = false;

        this.add.image(X_POSITION.CENTER, Y_POSITION.CENTER, 'background').setOrigin(0.5);
        this.add.image(X_POSITION.CENTER, 30, 'coin_panel').setOrigin(0.5).setDepth(10);

        this.coinText = this.add.text(X_POSITION.CENTER, 30, 'Coins: 0', {
            fontFamily: 'Verdana, Arial',
            fontSize: '37px',
            color: '#adadad'
        }).setOrigin(0.5).setDepth(10);

        this.darkenLayer = this.add.rectangle(X_POSITION.CENTER, Y_POSITION.CENTER, this.sys.game.canvas.width, this.sys.game.canvas.height, 0x000000, 0.5).setDepth(10);
        this.darkenLayer.alpha = 0.25;

        const buttonPlay = this.add.image(X_POSITION.CENTER, Y_POSITION.CENTER, 'btn_play').setOrigin(0.5).setDepth(10).setInteractive();

        buttonPlay.on('pointerup', () => {
            buttonPlay.clearTint();
            buttonPlay.setVisible(false);
            this.darkenLayer.setVisible(false);
            this.sound.play('snd_touch');
            this.sound.play('music_play', { loop: true, volume: 0.5 });
            this.physics.resume();
            this.gameStarted = true;
        });

        this.hitEnemy = (player, enemy) => {
    this.physics.pause();
    this.sound.play('snd_lose');
    localStorage.setItem("lastCoins", this.countCoin); // <-- Tambahkan ini
    this.scene.start('sceneGameOver', { score: this.countCoin });
};

        buttonPlay.on('pointerdown', () => buttonPlay.setTint(0x5a5a5a));
        buttonPlay.on('pointerout', () => buttonPlay.clearTint());

        const groundTemp = this.add.image(0, 0, 'ground').setVisible(false);
        const groundSize = { width: groundTemp.width, height: groundTemp.height };
        this.platforms = this.physics.add.staticGroup();

        this.coins = this.physics.add.group();
        this.enemies = this.physics.add.group();

        this.player = this.physics.add.sprite(100, 500, 'char');
        this.player.setGravityY(800);
        this.player.setBounce(0.2);
        this.player.setCollideWorldBounds(true);

        this.cursor = this.input.keyboard.createCursorKeys();
        this.snd_walk = this.sound.add('snd_walk');

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('char', { start: 5, end: 8 }),
            frameRate: 12,
            repeat: -1
        });

        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('char', { start: 0, end: 3 }),
            frameRate: 12,
            repeat: -1
        });

        this.anims.create({
            key: 'front',
            frames: [{ key: 'char', frame: 4 }],
            frameRate: 20
        });

        this.particles = this.add.particles('coin');

        this.prepareWorld = () => {
            this.platforms.clear(true, true);
            this.coins.clear(true, true);
            this.enemies.clear(true, true);

            for (let i = -4; i <= 4; i++) {
                this.platforms.create(X_POSITION.CENTER + i * groundSize.width, Y_POSITION.BOTTOM - groundSize.height / 2, 'ground');
            }

            if (this.currentLevel === 1) {
                this.platforms.create(100 + relativeSize.w, 384, 'ground');
                this.platforms.create(400 + relativeSize.w, 424, 'ground');
                this.platforms.create(900 + relativeSize.w, 480, 'ground');
                this.platforms.create(600 + relativeSize.w, 584, 'ground');
            } else if (this.currentLevel === 2) {
                this.platforms.create(80 + relativeSize.w, 284, 'ground');
                this.platforms.create(400 + relativeSize.w, 424, 'ground');
                this.platforms.create(900 + relativeSize.w, 480, 'ground');
                this.platforms.create(600 + relativeSize.w, 584, 'ground');
            } else {
                this.platforms.create(80 + relativeSize.w, 230, 'ground');
                this.platforms.create(400 + relativeSize.w, 230, 'ground');
                this.platforms.create(102 + relativeSize.w, 400, 'ground');
                this.platforms.create(200 + relativeSize.w, 524, 'ground');
                this.platforms.create(350 + relativeSize.w, 424, 'ground');
                this.platforms.create(600 + relativeSize.w, 584, 'ground');
            }

            for (let i = 0; i < 10; i++) {
                const coin = this.coins.create(60 + i * 100 + relativeSize.w, 100, 'coin');
                coin.setBounceY(Phaser.Math.FloatBetween(0.2, 0.3));
                coin.setCollideWorldBounds(true);
                coin.setDepth(5);
            }

            this.physics.add.collider(this.player, this.platforms);
            this.physics.add.collider(this.coins, this.platforms);
            this.physics.add.collider(this.enemies, this.platforms);
            this.physics.add.overlap(this.player, this.coins, this.collectCoin, null, this);
            this.physics.add.overlap(this.player, this.enemies, this.hitEnemy, null, this);

            if (this.currentLevel > 1) {
                const x = Phaser.Math.Between(100, this.sys.game.canvas.width - 100);
                const enemy = this.enemies.create(x, -100, 'enemy' + Phaser.Math.Between(1, 3));
                enemy.setBounce(1);
                enemy.setCollideWorldBounds(true);
                enemy.setVelocity(Phaser.Math.Between(-200, 200), 20);
                enemy.allowGravity = false;
            }
        };

        this.collectCoin = (player, coin) => {
            this.countCoin += 10;
            this.coinText.setText("Coins: " + this.countCoin);
            coin.disableBody(true, true);
            this.sound.play('snd_coin');
            this.particles.emitParticleAt(coin.x, coin.y, Phaser.Math.Between(5, 10));

            if (this.coins.countActive(true) === 0) {
                this.currentLevel++;
                this.gameStarted = false;
                this.physics.pause();
                this.sound.play('snd_leveling');
                this.prepareWorld();
                this.newLevelTransition();
            }
        };

        this.newLevelTransition = () => {
    // Layer gelap transparan
    const overlay = this.add.rectangle(
        X_POSITION.CENTER,
        Y_POSITION.CENTER,
        this.sys.game.canvas.width,
        this.sys.game.canvas.height,
        0x000000,
        0.6
    ).setDepth(20).setAlpha(0);

    // Teks Level
    const levelTransitionText = this.add.text(
        X_POSITION.CENTER,
        Y_POSITION.CENTER,
        'LEVEL ' + this.currentLevel,
        {
            fontFamily: 'Verdana, Arial',
            fontSize: '64px',
            color: '#ffff88',
            stroke: '#000',
            strokeThickness: 8,
            fontStyle: 'bold'
        }
    ).setOrigin(0.5).setDepth(21).setAlpha(0).setScale(0.7);

    // Fade-in overlay & teks, scale up
    this.tweens.add({
        targets: overlay,
        alpha: 1,
        duration: 300,
        ease: 'Power2'
    });

    this.tweens.add({
        targets: levelTransitionText,
        alpha: 1,
        scale: 1,
        duration: 600,
        ease: 'Back.Out',
        onStart: () => {
            this.sound.play('snd_leveling');
        }
    });

    // Fade-out setelah delay, lalu destroy
    this.time.delayedCall(1600, () => {
        this.tweens.add({
            targets: [overlay, levelTransitionText],
            alpha: 0,
            duration: 400,
            onComplete: () => {
                overlay.destroy();
                levelTransitionText.destroy();
                this.gameStarted = true;
                this.physics.resume();
            }
        });
    });
};
        this.prepareWorld();
        this.physics.pause(); // Tunggu start
    },

    update: function () {
        if (!this.gameStarted) return;

        if (this.cursor.right.isDown) {
            this.player.setVelocityX(200);
            this.player.anims.play('right', true);
            this.snd_walk.setVolume(1);
        } else if (this.cursor.left.isDown) {
            this.player.setVelocityX(-200);
            this.player.anims.play('left', true);
            this.snd_walk.setVolume(1);
        } else {
            this.player.setVelocityX(0);
            this.player.anims.play('front');
            this.snd_walk.setVolume(0);
        }

        if (this.cursor.up.isDown && this.player.body.touching.down) {
            this.player.setVelocityY(-650);
            this.sound.play('snd_jump');
        }
    }
});