import os
from flask import Flask, send_from_directory
# from flask_cors import CORS

app = Flask(__name__, static_folder="../react-app/build/")
# cors = CORS(app, origins='*')


@app.route("/")
def serve_main():
    return send_from_directory(app.static_folder, "./index.html")


@app.route('/<path:path>')
def send_report(path):
    if path != "" and os.path.exists(app.static_folder + '/' + path): #todo and not path contains robots
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')


if __name__ == "__main__":
    app.run(debug=True, port=5000)  # todo port to 80 in deployment
