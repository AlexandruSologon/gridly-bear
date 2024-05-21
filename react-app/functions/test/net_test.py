import pandapower as pp
from ..src import net, jsonParser
import unittest
import json

def basic_network():
    net = pp.create_empty_network(name="network")

    # create buses
    b1 = pp.create_bus(net, vn_kv=20., name="bus 1")
    b2 = pp.create_bus(net, vn_kv=.4, name="bus 2")
    b3 = pp.create_bus(net, vn_kv=.4, name="bus 3")

    # create bus elements
    pp.create_ext_grid(net, bus=b1, vm_pu=1.02, name="Grid connection")
    pp.create_load(net, bus=b3, p_mw=0.1, q_mvar=0.05, name="Load")

    # create branch elements
    pp.create_transformer(net, hv_bus=b1, lv_bus=b2, std_type="0.4 MVA 20/0.4 kV", name="Trafo")
    pp.create_line(net, from_bus=b2, to_bus=b3, length_km=0.1, name="Line", std_type="NAYY 4x50 SE")
    return net

def simple_load_generator():
    net = pp.create_empty_network(name="network")

    # create buses
    b1 = pp.create_bus(net, vn_kv=20., name="bus 1")
    b2 = pp.create_bus(net, vn_kv=.4, name="bus 2")

    # create bus elements
    # pp.create_ext_grid(net, bus=b1, vm_pu=1.02, name="Grid connection")
    pp.create.create_gen(net, slack=True, bus=b1, p_mw=5.0, name="house 1")
    pp.create_load(net, bus=b2, p_mw=5.0, q_mvar=5.0, name="Load")

    # create branch elements
    # pp.create_transformer(net, hv_bus=b1, lv_bus=b2, std_type="0.4 MVA 20/0.4 kV", name="Trafo")
    pp.create_line(net, from_bus=b1, to_bus=b2, length_km=5.0, name="Line", std_type="NAYY 4x50 SE")
    return net


class TestMyCases(unittest.TestCase):

    def test_problematic_lines(self):
        mynet = basic_network()
        pp.runpp(mynet)
        # print(net.res_bus)
        self.assertTrue((not net.problem_lines(mynet).empty))
        self.assertTrue(not len(net.problem_lines(mynet)) == 0)

    def test_problem_buses(self):
        mynet = basic_network()
        pp.runpp(mynet)
        self.assertTrue(len(net.problem_buses(mynet, 1.05, 0.95)) == 0)

    def test_all_buses(self):
        mynet = basic_network()
        pp.runpp(mynet)
        self.assertTrue(not len(net.all_buses(mynet)) == 0)

    def test_all_lines(self):
        mynet = simple_load_generator()
        pp.runpp(mynet)
        self.assertTrue(len(net.problem_lines(mynet)) == 1)

    def test_not_yet_sim_all_buses(self):
        mynet = basic_network()
        self.assertTrue(not len(net.problem_lines(mynet)) == 0 )

if __name__ == '__main__':
    unittest.main()
