import pandapower as pp


def problem_buses(net, high: float, low: float):
    # returns buses with voltages between high and low
    pp.runpp(net)
    return (net.res_bus.loc[net.res_bus.vm_pu > high].vm_pu +
            net.res_bus.loc[net.res_bus.vm_pu < low].vm_pu)


def all_buses(net):
    # returns all buses
    pp.runpp(net)
    return net.res_bus.vm_pu


def all_lines(net):
    # returns all lines
    pp.runpp(net)
    return net.res_line.loading_percent


def problem_lines(net):
    # returns lines running with more than 100% load percentage
    pp.runpp(net)
    return net.res_line.loc[net.res_line.loading_percent > 100].loading_percent
