import functions_framework
from firebase_functions import https_fn
from firebase_functions.options import CorsOptions
from firebase_admin import initialize_app
from firebase_functions import https_fn, options
import json

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
        cors_methods=["post"],))
def cnvs_json_post(req: https_fn.Request) -> https_fn.Response:
    return {'result': 0}
