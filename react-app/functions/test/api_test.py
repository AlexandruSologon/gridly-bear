import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

import unittest
from .. import main


def test_network():
    return ('{"data":{"components":[{"class":"bus","id":0,"pos":{"lat":51.90869633027845,"lng":4.407817839528435},'
            '"voltage":20},{"class":"bus","id":1,"pos":{"lat":51.90774321365463,"lng":4.458972929860466},'
            '"voltage":0.4},{"id":0,"class":"generator","bus":0,"p_mw":5, "vm_pu": null},{"id":0,"class":"load",'
            '"bus":1,"p_mv":5,"q_mvar":5},{"id":0,"class":"line","type":"NAYY 4x50 SE","bus1":0,"bus2":1,'
            '"length":5}]}}')


class TestAPIUsage(unittest.TestCase):

    def test3(self):
        print(main.cnvs_json_post(test_network()))

    def test2(self):
        pass

    def test1(self):
        pass


if __name__ == '__main__':
    unittest.main()
