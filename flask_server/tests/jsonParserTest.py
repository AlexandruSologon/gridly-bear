import unittest
import net_test as nt
import pandapower as pp
import flask_server.src.jsonParser as jsonParser


class JsonParserTest(unittest.TestCase):

    def test_printer(self):
        x = open("jsonParserTest.json", "r")
        network1 = jsonParser.parsejson(x.read())
        network2 = nt.basic_network()
        pp.runpp(network1)
        pp.runpp(network2)
        print(network1.res_bus), print(network2.res_bus)


if __name__ == '__main__':
    unittest.main()
