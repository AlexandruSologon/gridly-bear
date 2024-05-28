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
        green_blue = int(round(150 + (line - 70) * ((0 - 150) / (90 - 70)))) #formula for getting the exact range between green/blue being 0 to 150 between 70-90%
    return rgb_to_hex(150, green_blue, green_blue)

#safe_within: distance from one that's determined safe
#danger_zone: distance from 1 that's unacceptable
def get_bus_color(bus, safe_within=0.05, danger_zone=0.1):
    green_blue = 255 #default value
    if(1 + safe_within > bus > 1 - safe_within):
        green_blue = 150 # safe operating ranges
    elif(bus > (1 + danger_zone) or bus < (1 - danger_zone)):
        green_blue = 0 # render completely red in this range
    else: #relative danger, increasing linearly towards red until true danger range
        normalized_distance = abs(bus - 1.0) / danger_zone
        green_blue = int(round(150 * (1 - normalized_distance))) #formula for getting the exact range between green/blue being 0 to 150 between 1.05-1.1 and 0.95-0.9
    return rgb_to_hex(150, green_blue, green_blue)

def all_bus_colors(net):
    lines = all_buses(net)
    return lines.apply(get_bus_color)

def rgb_to_hex(r, g, b):
    return '#{:02x}{:02x}{:02x}'.format(r, g, b)

def runNetwork(net):
    try:
        pp.runpp(net)
    except Exception as e:
        raise NetworkInvalidError(str(e) + " - diagnostic results: " + str(pp.diagnostic(net)))
