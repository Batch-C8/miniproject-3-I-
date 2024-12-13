from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

'''# Load the pre-trained ML model
MODEL_PATH = "model/model.pkl"
with open(MODEL_PATH, "rb") as file:
    model = pickle.load(file)'''

@app.route("/")
def home():
    return "Welcome to the Ransomware Detection Backend!"

@app.route("/analyze", methods=["POST"])
def analyze():
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided"}), 400

    try:
        # Extract features
        features = [
            data.get("fileSize", 0), 
            data.get("entropyValue", 0), 
            int(data.get("executionBehavior", {}).get("encryptsData", 0)),
            int(data.get("executionBehavior", {}).get("networkConnection", 0)),
            int(data.get("executionBehavior", {}).get("dropsExecutables", 0))
        ]

        # Predict using the ML model
        prediction = model.predict([features])[0]  # Assuming model expects 2D array for features
        is_suspicious = bool(prediction)

        # Response to React
        result = {
            "fileName": data.get("fileName", "unknown"),
            "isSuspicious": is_suspicious,
            "message": "The file is suspicious." if is_suspicious else "The file is safe."
        }
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": f"An error occurred during analysis: {str(e)}"}), 500

if __name__ == "__main__":
    app.run(debug=True)

