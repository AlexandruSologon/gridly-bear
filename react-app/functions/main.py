import json
import traceback
from typing import Any

from firebase_admin import initialize_app
from firebase_functions import https_fn, options

from src import net as nt
from src import jsonParser

initialize_app()


# Hello world example function, do not use in deployment
@https_fn.on_request(cors=options.CorsOptions(
    cors_origins="*",
    cors_methods=["get", "post", "options"], ))
def hello_world() -> str:
    return json.dumps({"data": "hello!"})


# Handles the posting of json data corresponding to the canvas state
@https_fn.on_request(cors=options.CorsOptions(
    cors_origins="*",
    cors_methods=["get", "post", "options"], ))
def cnvs_json_post(req: https_fn.CallableRequest) -> dict[str, dict[str, dict[str, Any] | str]] | str:
    # returns a dictionary in the following form: {'data' : 'b"..."}
    # of which we take the value corresponding to 'data' as a key
    try:
        print("received data: " + str(req.data))
        dat = json.loads(req.data)['data']
        net = jsonParser.parsejson(dat)  # parse the data
        res = {'buses': nt.all_bus_colors(net).to_json(), 'lines': nt.all_line_colors(net).to_json()}
        return {'data': {'status': "S", 'sim_result': res, 'message': "Success!"}}
    except nt.NetworkInvalidError as e:
        print(e)
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
