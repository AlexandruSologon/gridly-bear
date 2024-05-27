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

#returns true if the network was already run with pandapower
def wasSimulated(net):
    return 'res_bus' in net and not net['res_bus'].empty

def all_line_colors(net):
    lines = all_lines(net)
    return lines.apply(get_line_color)

def get_line_color(line):
    #line here is a nunmber, it is the value loading_percent for a given line.
    print(line)
    green_blue = 255
    if(line < 70):
        green_blue = 150
    elif(line > 90):
        green_blue = 0
    else:
        green_blue = 150 + (line - 70) * ((0 - 150) / (90 - 70)) #formula for getting the exact range between green/blue being 0 to 150 between 70-90%
    return (150, green_blue, green_blue)

def all_bus_colors():
    pass

def runNetwork(net):
    try:
        pp.runpp(net)
    except Exception as e:
        raise NetworkInvalidError(str(e) + " - diagnostic results: " + str(pp.diagnostic(net)))
