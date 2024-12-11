import React, { useState } from "react";
import axios from "axios";
import "./FileUpload.css"; // Import the CSS file

const FileUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [result, setResult] = useState("");

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!selectedFile) {
      alert("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await axios.post("http://localhost:5000/predict", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setResult(response.data.result);
    } catch (error) {
      console.error("Error uploading the file:", error);
      setResult("Error: Unable to process the file.");
    }
  };

  return (
    <div className="upload-container">
      <h1>Ransomware Detection</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="file-upload" className="custom-file-upload">
          Choose File
        </label>
        <input id="file-upload" type="file" onChange={handleFileChange} />
        <button type="submit">Scan File</button>
      </form>
      {result && (
        <div className="result-message">
          <strong>Result:</strong> {result}
        </div>
      )}
    </div>
  );
};

export default FileUpload;

