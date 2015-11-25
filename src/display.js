export default class Display {
    constructor(canvas) {
        this.width = 64;
        this.height = 32;
        this.ctx = canvas.getContext("2d");
        this.canvas = canvas;
        this.screenDataBackBuffer = [];
        this.screenDataBuffer = [];
        this.requireDraw = false;
        this.pixelSize = 8;
        for (let i = 0; i < (this.width * this.height); i++) {
            this.screenDataBackBuffer[i] = 0;
        }
    }

    update() {
        if (this.requireDraw) {
            console.log('Display Updating!');
            this.render();
            this.requireDraw = false;
        }
    }

    render() {
        this.clear();
        this.screenDataBuffer = this.screenDataBackBuffer;
        var i, x, y;
        for (i = 0; i < this.screenDataBackBuffer.length; i++) {
            x = (i % this.width) * this.pixelSize;
            y = Math.floor(i / this.width) * this.pixelSize;


            if (this.screenDataBackBuffer[i] == 0) {
                 this.ctx.strokeStyle = 'blue';
                 this.ctx.strokeRect(x,y,this.pixelSize,this.pixelSize);
            } else {
                 this.ctx.fillStyle = 'red';
                 this.ctx.fillRect(x,y,this.pixelSize,this.pixelSize);
            }
        }
    }

    clear() {
        this.ctx.clearRect(0, 0, this.width * this.pixelSize, this.height * this.pixelSize);
    }

}
