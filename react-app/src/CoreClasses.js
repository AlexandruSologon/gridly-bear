class Bus {
    constructor(id, xcoord, ycoord) {
        this.id = id
        this.xcoord = xcoord
        this.ycoord = ycoord
    }

    move(newx, newy) {
        this.xcoord = newx
        this.ycoord = newy
    }
}

class Line {
    constructor(bus1, bus2) {
        this.bus1 = bus1
        this.bus2 = bus2
    }
}

class Transformer {
    constructor(highBus, lowBus, type) {
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

class Load {
    constructor(bus, power) {
        this.bus = bus
        this.power = power
    }
}

class Generator{
    constructor(bus, power) {
        this.bus = bus
        this.power = this.power
    }
}