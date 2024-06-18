import math
import unittest
import pandapower as pp
from ..src import net


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

    def test_get_line_color0(self):
        (h, s, l) = net.get_line_color(60)
        self.assertEqual((h, s, l), (81.42857142857142, 100, 50))

    def test_get_line_color1(self):
        (h, s, l) = net.get_line_color(80)
        self.assertEqual((h, s, l), (40, 100, 50))

    def test_get_line_color2(self):
        (h, s, l) = net.get_line_color(100)
        self.assertEqual((h, s, l), (16.666666666666664, 100, 50))

    def test_get_line_color3(self):
        (h, s, l) = net.get_line_color(130)
        self.assertEqual((h, s, l), (0, 100, 50))

    def test_get_line_color4(self):
        (h, s, l) = net.get_line_color(math.nan)
        self.assertEqual((h, s, l), (0, 1, 44))

    def test_get_bus_color0(self):
        (h, s, l) = net.get_bus_color(1.03)
        self.assertEqual((h, s, l), (92.99999999999997
                                     , 100, 50))

    def test_get_bus_color1(self):
        (h, s, l) = net.get_bus_color(1.07)
        self.assertEqual((h, s, l), (44.99999999999994
                                     , 100, 50))

    def test_get_bus_color2(self):
        (h, s, l) = net.get_bus_color(1.11)
        self.assertEqual((h, s, l), (12.499999999999877
                                     , 100, 50))

    def test_get_bus_color3(self):
        (h, s, l) = net.get_bus_color(1.21)
        self.assertEqual((h, s, l), (0, 100, 50))

    def test_get_bus_color4(self):
        (h, s, l) = net.get_bus_color(math.nan)
        self.assertEqual((h, s, l), (0, 0, 39))

    def test_all_buses(self):
        mynet = basic_network()
        pp.runpp(mynet)
        self.assertTrue(not len(net.all_buses(mynet)) == 0)

    def test_wasSimulated_true(self):
        myNet = basic_network()
        pp.runpp(myNet)
        self.assertTrue(net.wasSimulated(myNet))

    def test_wasSimulated_false(self):
        myNet = basic_network()
        self.assertFalse(net.wasSimulated(myNet))
        pp.runpp(myNet)
        self.assertTrue(net.wasSimulated(myNet))


if __name__ == '__main__':
    unittest.main()
