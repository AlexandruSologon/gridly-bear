import pandapower as pp
import pandapower.plotting as pplt
import matplotlib.pyplot as plt

net = pp.create_empty_network(name="network")

# create buses
b1 = pp.create_bus(net, vn_kv=20., name="bus 1")
b2 = pp.create_bus(net, vn_kv=.4, name="bus 2")
b3 = pp.create_bus(net, vn_kv=.4, name="bus 3")
