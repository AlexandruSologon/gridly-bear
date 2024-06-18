from typing import Any
import sys
import os
import json
from firebase_admin import initialize_app
from firebase_functions import https_fn, options
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from src import apiHandler
#comment

app = initialize_app()

# Hello world example function, do not use in deployment
@https_fn.on_request(cors=options.CorsOptions(
    cors_origins="*",
    cors_methods=["get", "post", "options"], ))
def hello_world() -> str:
    return json.dumps({"data": "hello!"})

# Handles the posting of json data corresponding to the canvas state
@https_fn.on_request(memory=2048,
cors=options.CorsOptions(
    cors_origins="*",
    cors_methods=["get", "post", "options"], 
))
def cnvs_json_post(req: https_fn.CallableRequest) -> https_fn.Response:
    # returns a dictionary in the following form: {'data' : 'b"..."}
    # of which we take the value corresponding to 'data' as a key
    return apiHandler.handle_sim_request(req.data)
