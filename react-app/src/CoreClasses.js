export class Bus {
    constructor(id, xcoord, ycoord, voltage) {
        this.class = "bus"
        this.id = id
        this.xcoord = xcoord
        this.ycoord = ycoord
        this.voltage = voltage
    }

    move(newx, newy) {
        this.xcoord = newx
        this.ycoord = newy
    }
}

export class Line {
    constructor(id, bus1, bus2, length, type) {
        this.id = id
        this.class = "line"
        this.length = length
        this.type = type
        this.bus1 = bus1
        this.bus2 = bus2
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

class Switch {
    constructor(from, to, type) {
        this.from = from
        this.to = to
        this.type = type
    }
}

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
    constructor(id, bus, power) {
        this.id = id
        this.bus = bus
        this.power = power
    }
}
export class Network {
    constructor(components){
        this.components = components
}
}





