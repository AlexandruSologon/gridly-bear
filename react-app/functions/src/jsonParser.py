import pandapower as pp
import json


class ParseDataException(Exception):
    def __init__(self, message="The data received could not be parsed properly"):
        self.message = message
        super().__init__(message)


def parsejson(x):
    try:
        # receives a json string as input and returns
        # the networks stored inside the string
        network = pp.create_empty_network()
        jsonrepr = json.loads(x)
        components = jsonrepr["components"]
        for component in components:
            match component["class"]:
                case "bus":
                    pp.create_bus(net=network, vn_kv=component["vn_kv"])
                case "ext-grid":
                    pp.create_ext_grid(net=network, bus=component["bus"],
                                       vm_pu=component["vm_pu"])
                case "load":
                    pp.create_load(net=network, bus=component["bus"], p_mw=component["p_mv"],
                                   q_mvar=component["q_mvar"])
                case "line":
                    pp.create_line(net=network, from_bus=component["bus1"], to_bus=component["bus2"],
                                   length_km=component["length"], std_type=component["type"])
                case "transformer":
                    pp.create_transformer(net=network, hv_bus=component["highBus"],
                                          lv_bus=component["lowBus"], std_type=component["type"])
                case "generator":
                    if component["vm_pu"] is not None:
                        pp.create.create_gen(net=network, slack=True, bus=component["bus"], p_mw=component["p_mw"],
                                             vm_pu=component["vm_pu"])
                    else:
                        pp.create.create_gen(net=network, slack=True, bus=component["bus"], p_mw=component["p_mw"])
                case "storage":
                    pp.create.create_storage(net=network, bus=component["bus"], p_mw=component["p_mw"], 
                                             max_e_mwh=component["max_e_mwh"], q_mvar=component["q_mvar"])
                case _:
                    raise ValueError
        return network
    except Exception as e:
        raise ParseDataException(e)
