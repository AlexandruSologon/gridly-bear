import {markerParametersConfig} from "./utils/constants";

class InvalidParameterInputException extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
    }
}
class Component {
    assigner (p,type)  {
    for( const key in p)
            if(p[key] !== null && p[key] !== '' ) {
                this[key] = p[key];
            }
                else
            {
                    if(markerParametersConfig[type].find(x => x.name === key).mandatory === 'true'){
                        throw new InvalidParameterInputException(key +' parameter in not set')}
                    else
                        this[key] = p[key]}}

}
export class Bus extends Component {
    vn_kv;
    constructor(id, pos, p) {
        super();
        this.class = "bus"
        this.id = id
        this.pos = pos
        this.assigner(p, 'bus')
    }
}

export class Line extends Component{
    constructor(id, bus1, bus2, length, type) {
        super();
        if(type === null || '')
            throw new InvalidParameterInputException('type parameter in not set')
        this.id = id
        this.class = "line"
        this.type = type
        this.bus1 = bus1
        this.bus2 = bus2
        this.length = length
    }
}

export class Transformer extends Component{
    constructor(id, highBus, lowBus, type) {
        super();
        if(type === null || '')
            throw new InvalidParameterInputException('type parameter in not set')
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

export class Load extends Component{
    p_mv;
    q_mvar;
    constructor(id, bus,p) {
        super();
        this.assigner(p,'load')
        this.id = id
        this.class = "load"
        this.bus = bus
    }
}

export class ExtGrid extends Component{
  constructor(id, bus, p) {
      super();
    this.id = id
    this.class = "ext-grid"
    this.bus = bus
    this.assigner(p,'grid')
  }
}

export class Generator extends Component{
    constructor(id, bus, p) {
        super();
        this.id = id
        this.class = "generator"
        this.bus = bus
        this.assigner(p, 'solar')
    }
}
export class Network {
    constructor(components){
        this.components = components
    }
}

export class Storage extends Component{
    constructor(id, bus, p) {
        super()
        this.id = id;
        this.class = "storage"
        this.bus = bus;
        this.assigner(p, 'battery')
    }
}