export default class Memory {
    constructor() {
        this.storage = new ArrayBuffer(0xFFF);
    }

    write (address, value) {
        for(let i = 0; i < value.length; i++) {
            this.storage[address + i] = value[i];
        }
    }

    read (address) {
        return this.storage[address];
    }
}
