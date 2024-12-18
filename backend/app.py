from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import pandas as pd

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Load the pre-trained ML model
MODEL_PATH = "model.pkl"
with open(MODEL_PATH, "rb") as file:
    model = pickle.load(file)

# Required feature list for the model
REQUIRED_KEYS = ['MajorLinkerVersion', 'Machine', 'DebugSize', 'DllCharacteristics', 'MajorOSVersion']

@app.route("/")
def home():
    return "Welcome to the Ransomware Detection Backend!"

@app.route("/analyze", methods=["POST"])
def analyze():
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided"}), 400

    # Validate that all required keys are present in the input
    missing_keys = [key for key in REQUIRED_KEYS if key not in data]
    if missing_keys:
        return jsonify({"error": f"Missing keys: {', '.join(missing_keys)}"}), 400

    try:
        # Extract features into a DataFrame
        features = pd.DataFrame(data=[[data.get(key, 0) for key in REQUIRED_KEYS]], columns=REQUIRED_KEYS)

        # Predict using the ML model
        prediction = model.predict(features)
        is_suspicious = bool(prediction[0])

        # Prepare the response
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



