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

def ultra_simple():
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

    def test_problem_line(self):
        net = basic_network()
        pp.runpp(net)
        # print(net.res_bus)
        self.assertTrue(1== 1)

    def test_problem_buses(self):
        net = ultra_simple()
        pp.runpp(net)
        #print(main.problem_buses(net, 1.05, 0.95))
        #self.assertTrue(len(main.problem_buses(net, 1.05, 0.95)) == 0)
        # print(net.res_bus)
    
    def test_json_run_simple(self):
        jj = '{"components":[{"class":"bus","id":0,"pos":{"lat":51.90869633027845,"lng":4.407817839528435},"voltage":20},{"class":"bus","id":1,"pos":{"lat":51.90774321365463,"lng":4.458972929860466},"voltage":0.4},{"id":0,"class":"generator","bus":0,"power":5},{"id":0,"class":"load","bus":1,"p_mv":5,"q_mvar":5},{"id":0,"class":"line","type":"NAYY 4x50 SE","bus1":0,"bus2":1,"length":5}]}'
        netw = jsonParser.parsejson(jj) #parse the data
        print(json.dumps((net.all_buses(netw).to_json(), net.all_lines(netw).to_json())))


if __name__ == '__main__':
    unittest.main()
