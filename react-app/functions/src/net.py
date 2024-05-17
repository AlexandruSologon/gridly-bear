import pandapower as pp

class NetworkInvalidError(Exception):
    def __init__(self, message="The network submitted was invalid and could not be run."):
        self.message = message
        super().__init__(self.message)

def problem_buses(net, high: float, low: float):
    # returns buses with voltages between high and low
    if(not wasSimulated(net)):
        runNetwork(net)
    return (net.res_bus.loc[net.res_bus.vm_pu > high].vm_pu +
            net.res_bus.loc[net.res_bus.vm_pu < low].vm_pu)

def all_buses(net):
    # returns all buses
    if(not wasSimulated(net)):
        runNetwork(net)
    return net.res_bus.vm_pu

def all_lines(net):
    # returns all lines
    if(not wasSimulated(net)):
        runNetwork(net)
    return net.res_line.loading_percent

def problem_lines(net):
    # returns lines running with more than 100% load percentage
    if(not wasSimulated(net)):
        runNetwork(net)
    return net.res_line.loc[net.res_line.loading_percent > 100].loading_percent

def wasSimulated(net):
    return 'res_bus' in net and not net['res_bus'].empty

def runNetwork(net):
    try:
        pp.runpp(net)
    except Exception as e:
        raise NetworkInvalidError(str(e))
