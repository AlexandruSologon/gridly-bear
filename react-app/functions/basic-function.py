import functions_framework

@functions_framework.http
def hello_world(request):
    """HTTP Cloud Function.
    Args:
        request (flask.Request): The request object.
        <http://flask.palletsprojects.com/en/1.1.x/api/#incoming-request-data>
    Returns:
        The response text, or any set of values that can be turned into a
        Response object using `make_response`
        <http://flask.palletsprojects.com/en/1.1.x/api/#flask.make_response>.
    """
    return '{"message": "Hello World!"}'
