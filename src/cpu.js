export default class CPU {

  constructor(memory) {
    this.memory = memory;
    this.registers = [];
    this.I = 0;
    this.pc = 0x200;
    this.stack = [];
    this.sp = 0;
    this.screenData = new ArrayBuffer(64 * 32);
    this.delay_timer = 0;
    this.sound_timer = 0;
  }

  step() {
      // Fetch Opcode
      // Decode Opcode
      // Execute Opcode
      // Update timers
  }

  pause() {
  }
}
