import functions_framework
from firebase_functions import https_fn
from firebase_functions.options import CorsOptions
from firebase_admin import initialize_app
from firebase_functions import https_fn, options
import json
import src.net as nt 
import src.jsonParser as jsonParser
from flask import jsonify

initialize_app()

#Hello world example function, do not use in deploymenet
@https_fn.on_request(cors=options.CorsOptions(
        cors_origins="*",
        cors_methods=["get", "post", "options"],))
def hello_world(req: https_fn.Request) -> https_fn.Response:
    return json.dumps({"data" : "hello!"})

#Handles the posting of json data corresponding to the canvas state
@https_fn.on_request(cors=options.CorsOptions(
        cors_origins="*",
        cors_methods=["get", "post", "options"],))
def cnvs_json_post(req: https_fn.CallableRequest) -> https_fn.Response:
        #returns a dictionary in the following form: {'data' : 'b"..."} of which we take the value corresponding to 'data' as a key
        try:
                dat = json.loads(req.data)['data']
                net = jsonParser.parsejson(dat) #parse the data
                res = {'data':json.dumps((nt.all_buses(net).to_json(), nt.all_lines(net).to_json()))} #can also use json.dumps()
                return res
        except nt.NetworkInvalidError as e:
               return json.dumps({'data' : {'status':"E", 'message':"Invalid network submitted: " + str(e)}})
        except jsonParser.ParseDataException:
               return json.dumps({'data' : {'status':"E", 'message':"Submitted data could not be parsed."}})
        except Exception as e:
               print("Something unexpected happened: ")
               print(e)
               return json.dumps({'data' : {'status':"E", 'message':"Server received invalid data."}}) #todo print only pandapower related errors to client
