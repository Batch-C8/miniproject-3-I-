import React, { useState } from "react";
import './FileUpload.css'

const FileUpload = () => {
  const [formData, setFormData] = useState({
    fileName: "",
    MajorLinkerVersion: "",
    Machine: "",
    DebugSize: "",
    DllCharacteristics: "",
    MajorOSVersion: "",
  });

  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResult(null);
    setError(null);

    try {
      const response = await fetch("http://127.0.0.1:5000/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h1>Ransomware Detection</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            File Name:
            <input
              type="text"
              name="fileName"
              value={formData.fileName}
              onChange={handleChange}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Major Linker Version:
            <input
              type="number"
              name="MajorLinkerVersion"
              value={formData.MajorLinkerVersion}
              onChange={handleChange}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Machine:
            <input
              type="number"
              name="Machine"
              value={formData.Machine}
              onChange={handleChange}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Debug Size:
            <input
              type="number"
              name="DebugSize"
              value={formData.DebugSize}
              onChange={handleChange}
              required
            />
          </label>
        </div>
        <div>
          <label>
            DLL Characteristics:
            <input
              type="number"
              name="DllCharacteristics"
              value={formData.DllCharacteristics}
              onChange={handleChange}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Major OS Version:
            <input
              type="number"
              name="MajorOSVersion"
              value={formData.MajorOSVersion}
              onChange={handleChange}
              required
            />
          </label>
        </div>
        <button type="submit">Analyze</button>
      </form>

      {result && (
        <div>
          <h2>Result</h2>
          <p>File Name: {result.fileName}</p>
          <p>
            {result.isSuspicious
              ?  "The file is safe."
              :"The file is suspicious." }
          </p>
        </div>
      )}

      {error && (
        <div>
          <h2>Error</h2>
          <p>{error}</p>
        </div>
      )}
    </div>
  );
};

export default FileUpload;

