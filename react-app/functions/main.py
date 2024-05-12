# Welcome to Cloud Functions for Firebase for Python!
# To get started, simply uncomment the below code or create your own.
# Deploy with `firebase deploy`

from firebase_functions import https_fn
from firebase_admin import initialize_app
import functions_framework
from firebase_functions import https_fn, options
from flask_cors import CORS, cross_origin

initialize_app()

@https_fn.on_request()
def on_request_example(req: https_fn.Request) -> https_fn.Response:
    return https_fn.Response("Hello world!")

# @functions_framework.https
# @cross_origin
# def helloWorld(request):
#     return '{"message": "Hello World!"}'
