import React, { useState } from "react";
import './FileUpload.css';

const FileUpload = () => {
  const [formData, setFormData] = useState({
    fileName: "",
    MajorLinkerVersion: "",
    Machine: "",
    DebugSize: "",
    DllCharacteristics: "",
    MajorOSVersion: "",
  });

  const [uploadedFile, setUploadedFile] = useState(null);
 // const [fileAttributes, setFileAttributes] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleScan = async () => {
    if (uploadedFile) {
      const formData = new FormData();
      formData.append("file", uploadedFile);

      try {
        const response = await fetch("https://ransomware-backend.onrender.com/scan", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();

        if (data && data.MajorLinkerVersion !== undefined) {
          // Set the file attributes correctly
          //setFileAttributes(data);
          setFormData({ ...formData, ...data });
        } else {
          throw new Error("Invalid response format");
        }
      } catch (err) {
        setError(err.message);
      }
    } else {
      alert("Please upload a file to scan.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResult(null);
    setError(null);

    try {
      const response = await fetch("https://ransomware-backend.onrender.com/analyze", {
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
              readOnly
            />
          </label>
        </div>
        <div>
          <input type="file" onChange={(e) => setUploadedFile(e.target.files[0])} />
          <button type="button" onClick={handleScan}>Scan</button>
          
          {error && <p style={{ color: "red" }}>{error}</p>}

         {/* {fileAttributes && (
            <div>
              <h3>File Attributes</h3>
              <ul>
                {Object.entries(fileAttributes).map(([key, value]) => (
                  <li key={key}>
                    <strong>{key}:</strong> {value}
                  </li>
                ))}
              </ul>
            </div> 
          )}  */}
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
          <p>{result.isSuspicious ? "The file is safe." :"The file is suspicious" }</p>
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
