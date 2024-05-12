import functions_framework
from firebase_functions import https_fn, options
from flask_cors import CORS, cross_origin

@functions_framework.https
@cross_origin
def helloWorld(request):
    return '{"message": "Hello World!"}'
