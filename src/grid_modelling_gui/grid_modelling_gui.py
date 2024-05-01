"""Main module."""
import pandapower as pp

def isworking(net):
    pp.runpp(net)
    if (net.res_bus.vm_pu.max() <= 1.05 and
        net.res_bus.vm_pu.min() >= 0.95 and
        net.res_line.loading_percent.max() <= 100):
        print("Network is working")
        return True
    else:
        print("Network is failing")
        return False
