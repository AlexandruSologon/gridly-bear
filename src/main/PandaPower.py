import pandapower as pp

net = pp.create_empty_network(name="network")

# create buses
b1 = pp.create_bus(net, vn_kv=20., name="bus 1")
b2 = pp.create_bus(net, vn_kv=.4, name="bus 2")
b3 = pp.create_bus(net, vn_kv=.4, name="bus 3")

# create bus elements
pp.create_ext_grid(net, bus=b1, vm_pu=1.02, name="Grid connection")
pp.create_load(net, bus=b3, p_mw=0.1, q_mvar=0.05, name="Load")

# create branch elements
tid = pp.create_transformer(net, hv_bus=b1, lv_bus=b2, std_type="0.4 MVA 20/0.4 kV", name="Trafo")
pp.create_line(net, from_bus=b2, to_bus=b3, length_km=0.1, name="Line", std_type="NAYY 4x50 SE")


pp.runpp(net)
if net.res_bus.vm_pu.max() <= 1.05 and net.res_bus.vm_pu.min() >= 0.95 and net.res_line.loading_percent.max() <= 100:
    print("Network is working")
else:
    print("Network is failing")
