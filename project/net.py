import pandapower as pp


def problem_buses(net, high: float, low: float):
    pp.runpp(net)
    return net.res_bus.loc[net.res_bus.vm_pu > high].index.tolist()


def problem_lines(net):
    pp.runpp(net)
    return net.res_line.loc[net.res_line.loading_percent > 100].index.tolist()
