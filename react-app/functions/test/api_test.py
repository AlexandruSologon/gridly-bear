import json
import sys
import os
import warnings

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

import unittest
from ..src import apiHandler as api

test_network = b'{"data":"{\\"components\\":[{\\"class\\":\\"bus\\",\\"id\\":0,\\"vn_kv\\":20},{\\"class\\":\\"bus\\",\\"id\\":1,\\"vn_kv\\":0.4},{\\"class\\":\\"bus\\",\\"id\\":2,\\"vn_kv\\":0.4},{\\"id\\":0,\\"class\\":\\"ext-grid\\",\\"bus\\":0,\\"vn_pu\\":1.02},{\\"id\\":0,\\"class\\":\\"line\\",\\"type\\":\\"NAYY 4x50 SE\\",\\"bus1\\":1,\\"bus2\\":2,\\"length\\":0.10214928534943585},{\\"id\\":0,\\"class\\":\\"load\\",\\"bus\\":2,\\"p_mv\\":0.1,\\"q_mvar\\":0.05},{\\"id\\":0,\\"class\\":\\"transformer\\",\\"highBus\\":0,\\"lowBus\\":1,\\"type\\":\\"0.25 MVA 20/0.4 kV\\"}]}"}'
test_network_fail_invalid_net = b'{"data":"{\\"components\\":[{\\"class\\":\\"bus\\",\\"id\\":0,\\"vn_kv\\":20},{\\"class\\":\\"bus\\",\\"id\\":1,\\"vn_kv\\":0.4},{\\"class\\":\\"bus\\",\\"id\\":2,\\"vn_kv\\":0.4},{\\"id\\":0,\\"class\\":\\"ext-grid\\",\\"bus\\":0,\\"vn_pu\\":1.02},{\\"id\\":0,\\"class\\":\\"line\\",\\"type\\":\\"NAYY 4x50 SE\\",\\"bus1\\":1,\\"bus2\\":2,\\"length\\":0.10214928534943585},{\\"id\\":0,\\"class\\":\\"load\\",\\"bus\\":2,\\"p_mv\\":null,\\"q_mvar\\":0.05},{\\"id\\":0,\\"class\\":\\"transformer\\",\\"highBus\\":0,\\"lowBus\\":1,\\"type\\":\\"0.25 MVA 20/0.4 kV\\"}]}"}'
test_network_fail_invalid_parse = b'{"data":"{\\"components\\":[{\\"class\\":\\"bus\\",\\"id\\":0,\\"vn_kv\\":20},{\\"class\\":\\"bus\\",\\"id\\":1,\\"vn_kv\\":0.4},{\\"class\\":\\"bus\\",\\"id\\":2,\\"vn_kv\\":0.4},{\\"id\\":0,\\"class\\":\\"ext-grid\\",\\"bus\\":0,\\"vn_pu\\":1.02},{\\"id\\":0,\\"class\\":\\"line\\",\\"type\\":null,\\"bus1\\":1,\\"bus2\\":2,\\"length\\":0.10214928534943585},{\\"id\\":0,\\"class\\":\\"load\\",\\"bus\\":2,\\"p_mv\\":0.1,\\"q_mvar\\":0.05},{\\"id\\":0,\\"class\\":\\"transformer\\",\\"highBus\\":0,\\"lowBus\\":1,\\"type\\":\\"0.25 MVA 20/0.4 kV\\"}]}"}'
class TestAPIUsage(unittest.TestCase):

    def test3(self):
        with warnings.catch_warnings(action='ignore'):
            result = api.handle_sim_request(test_network_fail_invalid_net)
            expected = json.dumps({"data": {"status": "E", "sim_result": "None", "message": "Invalid network submitted: Power Flow nr did not converge after 10 iterations! - diagnostic results: {'invalid_values': {'load': [(0, 'p_mw', 'nan', 'number')]}, 'overload': {'load': False, 'generation': False}, 'wrong_switch_configuration': False}"}})
            # self.assertEqual(expected, result)

    def test2(self):
        result = api.handle_sim_request(test_network)
        expected = {'data': {'message': 'Success!',
          'sim_result': {'buses': '{"0":[102.0,100,50],"1":[118.308908816,100,50],"2":[80.5017696789,100,50]}',
                         'lines': '{"0":[0.9497592439,100,50]}'},
          'status': 'S'}}
        # self.assertEqual(expected, result)

    def test1(self):
        result = api.handle_sim_request(test_network_fail_invalid_parse)
        expected = json.dumps({'data': {'status': "E", 'sim_result': "None", 'message': "Submitted data could not be parsed."}})
        self.assertEqual(expected, result)

    def test4(self):
        result = api.handle_sim_request(b'{"datas":{}}')
        expected = json.dumps({"data": {"status": "E", "sim_result": "None", "message": "Server received invalid data."}})
        self.assertEqual(expected, result)
    def test5(self):
        result = api.handle_sim_request(25)
        expected = json.dumps({"data": {"status": "E", "sim_result": "None", "message": "Server received invalid data."}})
        self.assertEqual(expected, result)

if __name__ == '__main__':
    unittest.main()
