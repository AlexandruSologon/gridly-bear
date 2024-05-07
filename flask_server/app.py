from flask import Flask,jsonify, render_template, send_file, send_from_directory
from flask_cors import CORS

app = Flask(__name__, static_folder="../react-app/build/")
cors = CORS(app, origins='*')

@app.route("/")
def serve_main():
    return send_from_directory(app.static_folder, "./index.html")

@app.route('/<path:path>')
def send_report(path):
    return send_from_directory(app.static_folder, path)

if __name__ == "__main__":
    app.run(debug=True, port=5000)
