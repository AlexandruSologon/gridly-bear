import flask_server.src.jsonParser as jsonParser
from flask import Flask, send_from_directory, request, jsonify
import flask_server.src.net as nt
# from flask_cors import CORS
app = Flask(__name__, static_folder="../react-app/build/")
# cors = CORS(app, origins='*')

@app.route("/")
def serve_main():
    return send_from_directory(app.static_folder, "./index.html")


@app.route("/run_sim",  methods=["PUT", "GET"])
def run_sim():
    # listens for PUT requests containing a network in json format
    # returns all the buses and lines data after sim is run
    if request.method == "GET":
        return jsonify("Hello World")
    else:
        if request.method == "PUT":
            net = jsonParser.parsejson(request.data)
            return jsonify((nt.all_buses(net).to_json(), nt.all_lines(net).to_json()))


'''
@app.route('/<path:path>')
def send_report(path):
    if path != "" and os.path.exists(app.static_folder + '/' + path):  # todo and not path contains robots
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')##
'''


if __name__ == "__main__":
    app.run(debug=True, port=5000)  # todo port to 80 in deployment
