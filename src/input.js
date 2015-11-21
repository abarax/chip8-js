export default class Input {

    constructor() {
        this.keys = [];
    }

    update() {
        console.log('Input Updating!');
    }

    getKey(key){
        return this.keys[key];
    }

    setKey(key){
        this.keys[key] = true;
    }
}
