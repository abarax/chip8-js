import CPU from 'chip-8/cpu';
import Memory from 'chip-8/memory';
import Display from 'chip-8/display';
import Input from 'chip-8/input';

export default class Chip8 {

  constructor() {
    this.running = false;
    this.memory = new Memory();
    this.cpu = new CPU(this.memory);
    this.display = new Display();
    this.input = new Input();
  }

  load(rom) {
      this.memory.loadProgram(rom);
  }

  start() {
      this.running = true;
      while(this.running) {
          this.cpu.step();
          this.display.update();
          this.input.update();
      }
  }

}
