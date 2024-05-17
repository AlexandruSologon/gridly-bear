import pandapower as pp
from ..src import net, jsonParser
import unittest
import json

class TestParsing(unittest.TestCase):

    def test_json_run_simple(self):
        j_data = '{"components":[{"class":"bus","id":0,"pos":{"lat":51.90869633027845,"lng":4.407817839528435},"voltage":20},{"class":"bus","id":1,"pos":{"lat":51.90774321365463,"lng":4.458972929860466},"voltage":0.4},{"id":0,"class":"generator","bus":0,"power":5},{"id":0,"class":"load","bus":1,"p_mv":5,"q_mvar":5},{"id":0,"class":"line","type":"NAYY 4x50 SE","bus1":0,"bus2":1,"length":5}]}'
        netw = jsonParser.parsejson(j_data) #parse the data
        pp.runpp(netw)
        self.assertTrue(not len(netw.res_bus) == 0)

    def test2(self):
        f = open('basic_network.json')
        j_data = f.read()
        f.close()
        netw = jsonParser.parsejson(j_data)
        pp.runpp(netw)
        self.assertTrue(not len(netw.res_bus) == 0)

if __name__ == '__main__':
    unittest.main()
