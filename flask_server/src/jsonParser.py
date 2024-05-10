import pandapower as pp
import json


def parsejson(x):
    network = pp.create_empty_network()
    components = json.loads(x)["components"]
    print(components)
    for component in components:
        match component["class"]:
            case "bus":
                pp.create_bus(net=network, vn_kv=component["voltage"])
            case "ext-grid":
                pp.create_ext_grid(net=network, bus=component["bus"],
                                   vm_pu=component["voltage"])
            case "load":
                pp.create_load(net=network, bus=component["bus"], p_mw=component["p_mv"], q_mvar=component["q_mvar"])
            case "line":
                pp.create_line(net=network, from_bus=component["bus1"], to_bus=component["bus2"],
                               length_km=component["length"], std_type=component["type"])
            case "transformer":
                pp.create_transformer(net=network, hv_bus=component["highBus"],
                                      lv_bus=component["lowBus"], std_type=component["type"])

    return network
