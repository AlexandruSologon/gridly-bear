from flask import Flask,jsonify
from flask_cors import CORS

app = Flask(__name__)
cors = CORS(app, origins='*')


@app.route("/api/hello")
def hello_world():
    hi = "Hello World!"
    return jsonify(hi)


if __name__ == "__main__":
    app.run(debug=True, port=8080)
