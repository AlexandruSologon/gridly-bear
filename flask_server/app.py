from flask import Flask,jsonify, render_template, send_file, send_from_directory
from flask_cors import CORS

app = Flask(__name__, template_folder="./resources")
cors = CORS(app, origins='*')

@app.route("/api/hello")
def hello_world():
    hi = "Hello World!"
    return jsonify(hi)

@app.route("/")
def skgrgkl():
    return send_from_directory(app.template_folder, "index.html")

# @app.route("/src/main.jsx")
# def dsadasdas():
#     return send_file("src/main.jsx")

if __name__ == "__main__":
    app.run(debug=True, port=8080)
