export default class CPU {

    constructor(memory) {
        this.memory = memory;
        this.registers = [];
        this.I = 0;
        this.pc = 0x200;
        this.stack = [];
        this.screenData = [];
        this.delay_timer = 0;
        this.sound_timer = 0;
    }

    step() {

        // Fetch Opcode
        let opCode = this.memory.read(this.pc) << 8 | this.memory.read(this.pc + 1);
        let x = (opcode & 0x0F00) >> 8;
        let y = (opcode & 0x00F0) >> 4;


        switch(opCode & 0xF000) {
            case 0x0000:
                switch(opCode & 0x000F) {
                    // 00E0 - CLS
                    // Clear the display.
                    case 0x0000:
                        for (let i = 0; i < this.screenData.length; i++) {
                            this.screenData[i] = 0;
                        }
                        break;
                    // 00EE - RET
                    // Return from a subroutine.
                    // The interpreter sets the program counter to the address at the top of the stack, then subtracts 1 from the stack pointer.
                    case 0x000E:
                        this.pc = this.stack.pop();
                        break;
                }
                break;
            // 1nnn - JP addr
            // Jump to location nnn.
            // The interpreter sets the program counter to nnn.
            case 0x1000:
                this.pc = opCode & 0x0FFF;
                break;
            // 2nnn - CALL addr
            // Call subroutine at nnn.
            // The interpreter increments the stack pointer, then puts the current PC on the top of the stack. The PC is then set to nnn.
            case 0x2000:
                this.stack.push(this.pc);
                this.pc = opCode & 0x0FFF;
                break;
            // 3xkk - SE Vx, byte
            // Skip next instruction if Vx = kk.
            // The interpreter compares register Vx to kk, and if they are equal, increments the program counter by 2.
            case 0x3000:
                if(this.registers[opCode & 0x0F00] == (opCode & 0x00FF)) {
                    this.pc += 2;
                }
                break;
            // 4xkk - SNE Vx, byte
            // Skip next instruction if Vx != kk.
            // The interpreter compares register Vx to kk, and if they are not equal, increments the program counter by 2.
            case 0x4000:
                if(this.registers[x] != (opCode & 0x00FF)) {
                    this.pc += 2;
                }
                break;
            // 5xy0 - SE Vx, Vy
            // Skip next instruction if Vx = Vy.
            // The interpreter compares register Vx to register Vy, and if they are equal, increments the program counter by 2.
            case 0x5000:
                if(this.registers[x] == this.registers[y]) {
                    this.pc += 2;
                }
                break;
            // 6xkk - LD Vx, byte
            // Set Vx = kk.
            // The interpreter puts the value kk into register Vx.
            case 0x6000:
                this.registers[x] = (opCode & 0x00FF);
                this.pc++
                break;
            // 7xkk - ADD Vx, byte
            // Set Vx = Vx + kk.
            // Adds the value kk to the value of register Vx, then stores the result in Vx. 
            case 0x7000:
                this.registers[x] += (opCode & 0x00FF);
                this.pc++
                break;
            case 0x8000:
                switch(opcode & 0x000F) {
                    // 8xy0 - LD Vx, Vy
                    // Set Vx = Vy.
                    // Stores the value of register Vy in register Vx.
                    case 0x0000:
                        this.registers[x] = this.registers[y];
                        this.pc++;
                        break;
                    // 8xy1 - OR Vx, Vy
                    // Set Vx = Vx OR Vy.
                    // Performs a bitwise OR on the values of Vx and Vy, then stores the result in Vx. A bitwise OR compares the corrseponding bits from two values, and if either bit is 1, then the same bit in the result is also 1. Otherwise, it is 0. 
                    case 0x0001:
                        this.registers[x] |= this.registers[y];
                        this.pc++;
                        break;
                    // 8xy2 - AND Vx, Vy
                    // Set Vx = Vx AND Vy.
                    // Performs a bitwise AND on the values of Vx and Vy, then stores the result in Vx. A bitwise AND compares the corrseponding bits from two values, and if both bits are 1, then the same bit in the result is also 1. Otherwise, it is 0. 
                    case 0x0002:
                        this.registers[x] &= this.registers[y];
                        this.pc++;
                        break;
                    // 8xy3 - XOR Vx, Vy
                    // Set Vx = Vx XOR Vy.
                    // Performs a bitwise exclusive OR on the values of Vx and Vy, then stores the result in Vx. An exclusive OR compares the corrseponding bits from two values, and if the bits are not both the same, then the corresponding bit in the result is set to 1. Otherwise, it is 0. 
                    case 0x0003:
                        this.registers[x] ^= this.registers[y];
                        this.pc++;
                        break;
                    // 8xy4 - ADD Vx, Vy
                    // Set Vx = Vx + Vy, set VF = carry.
                    // The values of Vx and Vy are added together. If the result is greater than 8 bits (i.e., > 255,) VF is set to 1, otherwise 0. Only the lowest 8 bits of the result are kept, and stored in Vx.
                    case 0x0004:
                        var result = this.registers[x] += this.registers[y];
                        if (result > 255) {
                            this.registers[0xF] = 1;
                        } else {
                            this.registers[0xF] = 0;
                        this.pc++;
                        }
                        break;
                    // 8xy5 - SUB Vx, Vy
                    // Set Vx = Vx - Vy, set VF = NOT borrow.
                    // If Vx > Vy, then VF is set to 1, otherwise 0. Then Vy is subtracted from Vx, and the results stored in Vx.
                    case 0x0005:
                        var result = this.registers[x] -= this.registers[y];
                        if (x > y) {
                            this.registers[0xF] = 1;
                        } else {
                            this.registers[0xF] = 0;
                        }
                        this.pc++;
                        break;
                    // 8xy6 - SHR Vx {, Vy}
                    // Set Vx = Vx SHR 1.
                    // If the least-significant bit of Vx is 1, then VF is set to 1, otherwise 0. Then Vx is divided by 2.
                    case 0x0006:
                        if ((x & 1) == 1) {
                            this.registers[0xF] = 1;
                        } else {
                            this.registers[0xF] = 0;
                        }
                        //divide by 2
                        this.registers[x] >>= 1;
                        this.pc++;
                        break;
                    // 8xy7 - SUBN Vx, Vy
                    // Set Vx = Vy - Vx, set VF = NOT borrow.
                    // If Vy > Vx, then VF is set to 1, otherwise 0. Then Vx is subtracted from Vy, and the results stored in Vx.
                    case 0x0007:
                        if (this.registers[y] > this.registers[x]) {
                            this.registers[0xF] = 1;
                        } else {
                            this.registers[0xF] = 0;
                        }
                        var result = this.registers[y] - this.registers[x];
                        this.registers[x] = result;
                        this.pc++;
                        break;
                    // 8xyE - SHL Vx {, Vy}
                    // Set Vx = Vx SHL 1.
                    // If the most-significant bit of Vx is 1, then VF is set to 1, otherwise to 0. Then Vx is multiplied by 2.
                    case 0x000E:
                        if ((x & 128) == 1) {
                            this.registers[0xF] = 1;
                        } else {
                            this.registers[0xF] = 0;
                        }
                        //multiply by 2
                        this.registers[x] <<= 1;
                        this.pc++;
                        break;
                }
                break;
            // 9xy0 - SNE Vx, Vy
            // Skip next instruction if Vx != Vy.
            // The values of Vx and Vy are compared, and if they are not equal, the program counter is increased by 2.
            case 0x9000:
                break;
            // Annn - LD I, addr
            // Set I = nnn.
            // The value of register I is set to nnn.
            case 0xA000:
                break;
            // Bnnn - JP V0, addr
            // Jump to location nnn + V0.
            // The program counter is set to nnn plus the value of V0.
            case 0xB000:
                break;
            // Cxkk - RND Vx, byte
            // Set Vx = random byte AND kk.
            // The interpreter generates a random number from 0 to 255, which is then ANDed with the value kk. The results are stored in Vx. See instruction 8xy2 for more information on AND.
            case 0xC000:
                break;
            // Dxyn - DRW Vx, Vy, nibble
            // Display n-byte sprite starting at memory location I at (Vx, Vy), set VF = collision.
            // The interpreter reads n bytes from memory, starting at the address stored in I. 
            // These bytes are then displayed as sprites on screen at coordinates (Vx, Vy). 
            // Sprites are XORed onto the existing screen. If this causes any pixels to be erased, VF is set to 1, otherwise it is set to 0. 
            // If the sprite is positioned so part of it is outside the coordinates of the display, it wraps around to the opposite side of the screen. 
            // See instruction 8xy3 for more information on XOR, and section 2.4, Display, for more information on the Chip-8 screen and sprites.
            case 0xD000:
                break;
            case 0xE000:
                switch (opcode & 0x000F) {
                    // Ex9E - SKP Vx
                    // Skip next instruction if key with the value of Vx is pressed.
                    // Checks the keyboard, and if the key corresponding to the value of Vx is currently in the down position, PC is increased by 2.
                    case 0x000E:
                        break;
                    // ExA1 - SKNP Vx
                    // Skip next instruction if key with the value of Vx is not pressed.
                    // Checks the keyboard, and if the key corresponding to the value of Vx is currently in the up position, PC is increased by 2.
                    case 0x0001:
                        break;
                }
                break;
            case 0xF000:
                switch (opcode & 0x00FF) {
                    // Fx07 - LD Vx, DT
                    // Set Vx = delay timer value.
                    // The value of DT is placed into Vx.
                    case 0x0007:
                        break;
                    // Fx0A - LD Vx, K
                    // Wait for a key press, store the value of the key in Vx.
                    // All execution stops until a key is pressed, then the value of that key is stored in Vx.
                    case 0x000A:
                        break;
                    // Fx15 - LD DT, Vx
                    // Set delay timer = Vx.
                    // DT is set equal to the value of Vx.
                    case 0x0015:
                        break;
                    // Fx18 - LD ST, Vx
                    // Set sound timer = Vx.
                    // ST is set equal to the value of Vx.
                    case 0x0018:
                        break;
                    // Fx1E - ADD I, Vx
                    // Set I = I + Vx.
                    // The values of I and Vx are added, and the results are stored in I.
                    case 0x001E:
                        break;
                    // Fx29 - LD F, Vx
                    // Set I = location of sprite for digit Vx.
                    // The value of I is set to the location for the hexadecimal sprite corresponding to the value of Vx. See section 2.4, Display, for more information on the Chip-8 hexadecimal font.
                    case 0x0029:
                        break;
                    // Fx33 - LD B, Vx
                    // Store BCD representation of Vx in memory locations I, I+1, and I+2.
                    // The interpreter takes the decimal value of Vx, and places the hundreds digit in memory at location in I, the tens digit at location I+1, and the ones digit at location I+2.
                    case 0x0033:
                        break;
                    // Fx55 - LD [I], Vx
                    // Store registers V0 through Vx in memory starting at location I.
                    // The interpreter copies the values of registers V0 through Vx into memory, starting at the address in I.
                    case 0x0055:
                        break;
                    // Fx65 - LD Vx, [I]
                    // Read registers V0 through Vx from memory starting at location I.
                    // The interpreter reads values from memory starting at location I into registers V0 through Vx.
                    case 0x0065:
                        break;
                }
                break;
            default:
                throw new Error(`Unsupported OpCode! ${opCode.toString(16)}`);
        }
        // Execute Opcode
        // Update timers
    }

    executeOpCode() {
    }

    pause() {
    }
}
