import json
import os
import sys
import traceback

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../src')))
import jsonParser
import net as nt


def handle_sim_request(data):
    # returns a dictionary in the following form: {'data' : 'b"..."}
    # of which we take the value corresponding to 'data' as a key
    try:
        print("received client data: " + str(data))
        dat = json.loads(data)['data']
        net = jsonParser.parsejson(dat)  # parse the data
        res = {
            'buses': nt.all_bus_colors(net).to_json(), 
            'lines': nt.all_line_colors(net).to_json(),
            'bus_results': nt.all_buses(net).to_json(),
            'line_results': nt.all_lines(net).to_json()
        }
        return {'data': {'status': "S", 'sim_result': res, 'message': "Success!"}}
    except nt.NetworkInvalidError as e:
        return json.dumps(
            {'data': {'status': "E", 'sim_result': "None", 'message': "Invalid network submitted: " + str(e)}})
    except jsonParser.ParseDataException as e:
        print(e)
        return json.dumps(
            {'data': {'status': "E", 'sim_result': "None", 'message': "Submitted data could not be parsed."}})
    except Exception as e:
        print("Something unexpected happened: ")
        print(e)
        traceback.print_exc()
        return json.dumps({'data': {'status': "E", 'sim_result': "None",
                                    'message': "Server received invalid data."}})
