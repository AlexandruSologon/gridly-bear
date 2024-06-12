export class Bus {
    constructor(id, pos, voltage) {
        this.class = "bus"
        this.id = id
        this.pos = pos
        this.voltage = voltage
    }
}

export class Line {
    constructor(id, bus1, bus2, length, type) {
        this.id = id
        this.class = "line"
        this.type = type
        this.bus1 = bus1
        this.bus2 = bus2
        this.length = length
    }
}

export class Transformer {
    constructor(id, highBus, lowBus, type) {
        this.id = id
        this.class = "transformer"
        this.highBus = highBus
        this.lowBus = lowBus
        this.type = type
    }
}

// class Switch {
//     constructor(from, to, type) {
//         this.from = from
//         this.to = to
//         this.type = type
//     }
// }

export class Load {
    constructor(id, bus, p_mv, q_mvar) {
        this.id = id
        this.class = "load"
        this.bus = bus
        this.p_mv = p_mv
        this.q_mvar = q_mvar
    }
}

export class ExtGrid {
  constructor(id, bus, voltage) {
    this.id = id
    this.class = "ext-grid"
    this.bus = bus
    this.voltage = voltage
  }
}

export class Generator{
    constructor(id, bus, power, voltageSetLevel) {
        this.id = id
        this.class = "generator"
        this.bus = bus
        this.p_mw = power
        this.vm_pu = voltageSetLevel
    }
}
export class Network {
    constructor(components){
        this.components = components
    }
}