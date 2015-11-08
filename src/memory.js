export default class Memory {
    constructor() {
        this.storage = new ArrayBuffer(0xFFF);
    }

    loadProgram(rom) {
        for (let i = 0; i < rom.length; i++) {
            this.storage[i + 0x200] = rom[i];
        }
    }
}
