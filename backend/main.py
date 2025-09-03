from flask import Flask
import os
from modules.cartoonCalc.route import cartoonCalc
from flask_cors import CORS

app = Flask(__name__)

app.secret_key = "primeInternal"
CORS(app)

@app.route("/")
def home():
    return "root route"

app.register_blueprint(cartoonCalc)

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=9699)


