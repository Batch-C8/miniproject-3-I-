from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import pandas as pd
import os
import pefile

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

@app.route("/scan", methods=["POST"])
def scan_file():
    if 'file' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files['file']

    if not file.filename.endswith(('.exe', '.dll')):
        return jsonify({"error": "Invalid file type. Only .exe and .dll files are allowed."}), 400

    try:
        file_path = os.path.join("uploads", file.filename)
        file.save(file_path)

        pe = pefile.PE(file_path)

        # Extract required attributes
        attributes = {
            "fileName": file.filename,
            "MajorLinkerVersion": pe.OPTIONAL_HEADER.MajorLinkerVersion,
            "Machine": pe.FILE_HEADER.Machine,
            "DebugSize": pe.OPTIONAL_HEADER.SizeOfInitializedData,
            "DllCharacteristics": pe.OPTIONAL_HEADER.DllCharacteristics,
            "MajorOSVersion": pe.OPTIONAL_HEADER.MajorOperatingSystemVersion,
        }

        # Clean up saved file
        #os.remove(file_path)

        # Print attributes to console
        for key, value in attributes.items():
            print(f"{key}: {value}")

        # Return attributes as a JSON object (instead of a list)
        return jsonify(attributes), 200

    except Exception as e:
        return jsonify({"error": f"Error processing the file: {str(e)}"}), 500

if __name__ == "__main__":
    os.makedirs("uploads", exist_ok=True)
    app.run(debug=True)







