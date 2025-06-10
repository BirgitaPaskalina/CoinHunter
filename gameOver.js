var sceneGameOver = new Phaser.Class({
    Extends: Phaser.Scene,

    initialize: function () {
        Phaser.Scene.call(this, { key: 'sceneGameOver' });
    },

    create: function () {
        const centerX = this.sys.game.config.width / 2;
        const centerY = this.sys.game.config.height / 2;

this.add.rectangle(
    centerX,
    centerY,
    this.sys.game.config.width,
    this.sys.game.config.height,
    0x000000,
    0.9 // alpha transparansi, bisa diubah sesuai kebutuhan
).setDepth(0);

        const Text = this.add.image(centerX, centerY - 135, 'gameover').setOrigin(0.5);
    
        const lastCoins = localStorage.getItem("lastCoins") || 0;

        const coinText = this.add.text(centerX, centerY - 40, `Coins Collected: ${lastCoins}`, {
            fontSize: '38px',
            color: '#ffff88',
            fontFamily: 'Verdana',
            stroke: '#000',
            strokeThickness: 4
        }).setOrigin(0.5);
        coinText.alpha = 0;

        this.tweens.add({
            targets: coinText,
            alpha: 1,
            duration: 600,
            ease: 'Power2'
        });

        // Tampilkan instruksi "Tap to Retry"
        const retryText = this.add.text(centerX, centerY + 40, "Tap to Retry", {
            fontSize: '28px',
            color: '#ffffff',
            fontFamily: 'Verdana'
        }).setOrigin(0.5);
        retryText.alpha = 0;

        this.tweens.add({
            targets: retryText,
            delay: 800,
            alpha: 1,
            duration: 500,
            ease: 'Power2',
            yoyo: true,
            repeat: -1
        });

        // Restart game
        this.input.once('pointerdown', () => {
            this.scene.start('scenePlay');
        });
    }
});
