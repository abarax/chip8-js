export default class Input {

    constructor() {
        this.keys = [];
        window.addEventListener('keyup', event  => { this.onKeyup(event); }, false);
        window.addEventListener('keydown', event => { this.onKeydown(event); }, false);
        this.keyMap = {
            0x0: 88,
            0x1: 49,
            0x2: 50,
            0x3: 51,
            0x4: 81,
            0x5: 87,
            0x6: 69,
            0x7: 65,
            0x8: 83,
            0x9: 68,
            0xA: 90,
            0xB: 67,
            0xC: 52,
            0xD: 82,
            0xE: 70,
            0xF: 86

        }
    }

    update() {
        console.log('Input Updating!');
    }

    getKey(key){
        return this.keys[this.keyMap[key]];
    }

    onKeydown(event) {
        this.keys[event.keyCode] = true;
    }

    onKeyup(event) {
        this.keys[event.keyCode] = false;
    }
}
