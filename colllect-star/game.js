const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false // Aktifkan debug untuk melihat collider
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update,
    }
};

const game = new Phaser.Game(config);

let player;
let stars;
let platforms;
let cursors;
let score = 0;
let scoreText;

function preload() {
    this.load.image('sky', 'assets/sky.png');
    this.load.image('ground', 'assets/platform.png');
    this.load.image('star', 'assets/star.png');
    this.load.spritesheet('dude', 'assets/dude.png', {
        frameWidth: 44.8,
        frameHeight: 93
    });
}

function create() {
    // Background
    this.add.image(400, 300, 'sky');

    // Platforms
    platforms = this.physics.add.staticGroup();
    platforms.create(400, 550 , 'ground').setScale(1).refreshBody();
    platforms.create(600, 450, 'ground').setScale(0.8).refreshBody();
    platforms.create(350, 350, 'ground').setScale(0.8).refreshBody();
    platforms.create(600, 250, 'ground').setScale(0.8).refreshBody();
    platforms.create(300, 150 , 'ground').setScale(0.8).refreshBody();
    platforms.create(600, 50, 'ground').setScale(0.8).refreshBody();
    platforms.create(350, -150, 'ground').setScale(0.8).refreshBody();
    platforms.create(600, -250, 'ground').setScale(0.8).refreshBody();

    // Player
    player = this.physics.add.sprite(100, 450, 'dude');
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);
    player.body.setGravityY(200); // Tambahkan gravitasi agar lompat terasa lebih natural

    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
        frameRate: 12,
        repeat: -1
    });

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
        frameRate: 12,
        repeat: -1
    });

    this.anims.create({
        key: 'front',
        frames: [{ key: 'dude', frame: 4 }],
        frameRate: 20
    });

    // Bintang
    stars = this.physics.add.group({
        key: 'star',
        repeat: 11,
        setXY: { x: 12, y: 0, stepX: 70 }
    });

    stars.children.iterate(function (child) {
        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    });

    // Skor
    scoreText = this.add.text(16, 16, 'Score: 0', {
        fontSize: '32px',
        fill: '#000'
    });

    // Collider
    this.physics.add.collider(player, platforms);
    this.physics.add.collider(stars, platforms);
    this.physics.add.overlap(player, stars, collectStar, null, this);

    // Input
    cursors = this.input.keyboard.createCursorKeys();
}

function update() {
    if (cursors.right.isDown) {
        player.setVelocityX(200);
        player.anims.play('right', true);
    } else if (cursors.left.isDown) {
        player.setVelocityX(-200);
        player.anims.play('left', true);
    } else {
        player.setVelocityX(0);
        player.anims.play('front');
    }

    // Lompat dengan cek block bawah, bukan touching.down
    if (cursors.up.isDown && player.body.blocked.down) {
        player.setVelocityY(-330);
    }

    // Cek Game Over
    if (player.y > 600) {
        this.scene.restart();
        score = 0;
    }
}

function collectStar(player, star) {
    star.disableBody(true, true);
    score += 10;
    scoreText.setText('Score: ' + score);

    if (stars.countActive(true) === 0) {
        stars.children.iterate(function (child) {
            child.enableBody(true, child.x, 0, true, true);
        });
    }
}
