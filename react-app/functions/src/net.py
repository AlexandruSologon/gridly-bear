import math

import pandapower as pp


class NetworkInvalidError(Exception):
    def __init__(self, message="The network submitted was invalid and could not be run."):
        self.message = message
        super().__init__(self.message)


def problem_buses(net, high: float, low: float):
    # returns buses with voltages between high and low
    if not wasSimulated(net):
        runNetwork(net)
    return (net.res_bus.loc[net.res_bus.vm_pu > high].vm_pu +
            net.res_bus.loc[net.res_bus.vm_pu < low].vm_pu)


def all_buses(net):
    # returns all buses
    if not wasSimulated(net):
        runNetwork(net)
    return net.res_bus.vm_pu


def all_lines(net):
    # returns all lines
    if not wasSimulated(net):
        runNetwork(net)
    return net.res_line.loading_percent


def problem_lines(net):
    # returns lines running with more than 100% load percentage
    if not wasSimulated(net):
        runNetwork(net)
    return net.res_line.loc[net.res_line.loading_percent > 100].loading_percent


#  returns true if the network was already run with pandapower
def wasSimulated(net):
    return 'res_bus' in net and not net['res_bus'].empty


def all_line_colors(net):
    lines = all_lines(net)
    print(net.res_line)
    return lines.apply(get_line_color)


def get_line_color(line, safe_below=70, bad_above=90):
    if not math.isnan(line):
        # colors starts from bright green
        hue = 120
        # move towards yellow the closer line gets to safe_below
        if line <= safe_below:
            hue = hue - line * (45 / 70)
        # move towards red the closer line gets to bad_above
        elif line <= bad_above:
            hue = hue - 55 - (line - safe_below) * (50 / bad_above - safe_below)
        else:
            # when line > bad_above red return max value red
            hue = max(hue - 95 - (line - bad_above) * (25 / (120 - bad_above)), 0)
        return hue, 100, 50
    return 0, 1, 44


# safe_within: distance from one that's determined safe
# danger_zone: distance from 1 that's unacceptable
def get_bus_color(bus, safe_within=0.05, danger_zone=0.1):
    # color starts from bright green
    if not math.isnan(bus):
        hue = 120
        bus = abs(bus - 1)
        # move towards yellow the closer bus gets to safe_within
        if bus <= safe_within:
            hue = hue - bus * (0.45 / safe_within)
        # move towards red the closer bus gets to danger_zone
        elif bus <= danger_zone:
            hue = hue - 55 - (bus - safe_within) * (0.50 / (danger_zone - safe_within))
        else:
            # when bus > danger_zone red return max value red
            hue = max(hue - 95 - (bus - danger_zone) * (0.25 / (0.12 - danger_zone)), 0)
        return hue, 100, 50
    return 0, 0, 39


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
