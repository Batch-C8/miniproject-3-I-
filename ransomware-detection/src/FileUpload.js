import React, { useState } from 'react';
import './FileUpload.css';

const FileUpload = () => {
  const [formData, setFormData] = useState({
    fileName: '',
    fileExtension: '',
    fileSize: '',
    lastModified: '',
    entropyValue: '',
    suspiciousStrings: [],
    signatureValidity: '',
    hashValue: '',
    executionBehavior: {
      encryptsData: false,
      networkConnection: false,
      dropsExecutables: false,
    },
    networkActivity: '',
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const suspiciousOptions = ['cmd.exe', 'powershell', 'decrypt', 'ransom'];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData({
      ...formData,
      executionBehavior: {
        ...formData.executionBehavior,
        [name]: checked,
      },
    });
  };

  const handleMultiSelectChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions, (option) => option.value);
    setFormData({ ...formData, suspiciousStrings: selectedOptions });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://127.0.0.1:5000/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze the file.');
      }

      const data = await response.json();
      setResult(data); // Assuming the Flask API returns a JSON object with analysis results
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      fileName: '',
      fileExtension: '',
      fileSize: '',
      lastModified: '',
      entropyValue: '',
      suspiciousStrings: [],
      signatureValidity: '',
      hashValue: '',
      executionBehavior: {
        encryptsData: false,
        networkConnection: false,
        dropsExecutables: false,
      },
      networkActivity: '',
    });
    setResult(null);
    setError(null);
  };

  return (
    <div className="form-container">
      <h2>Ransomware Detection Interface</h2>
      <form onSubmit={handleSubmit}>
        <label>
          File Name:
          <input type="text" name="fileName" value={formData.fileName} onChange={handleInputChange} />
        </label>
        <label>
          File Extension:
          <select name="fileExtension" value={formData.fileExtension} onChange={handleInputChange}>
            <option value="">Select</option>
            <option value=".exe">.exe</option>
            <option value=".dll">.dll</option>
            <option value=".docx">.docx</option>
            <option value=".zip">.zip</option>
          </select>
        </label>
        <label>
          File Size (KB):
          <input type="number" name="fileSize" value={formData.fileSize} onChange={handleInputChange} />
        </label>
        <label>
          Last Modified Date:
          <input type="date" name="lastModified" value={formData.lastModified} onChange={handleInputChange} />
        </label>
        <label>
          Entropy Value:
          <input type="number" name="entropyValue" step="0.01" value={formData.entropyValue} onChange={handleInputChange} />
        </label>
        <label>
          Suspicious Strings:
          <select multiple value={formData.suspiciousStrings} onChange={handleMultiSelectChange}>
            {suspiciousOptions.map((string, index) => (
              <option key={index} value={string}>{string}</option>
            ))}
          </select>
        </label>
        <label>
          Digital Signature Validity:
          <select name="signatureValidity" value={formData.signatureValidity} onChange={handleInputChange}>
            <option value="">Select</option>
            <option value="Valid">Valid</option>
            <option value="Invalid">Invalid</option>
            <option value="Unsigned">Unsigned</option>
          </select>
        </label>
        <label>
          Hash Value (SHA-256):
          <input type="text" name="hashValue" value={formData.hashValue} onChange={handleInputChange} />
        </label>
        <fieldset>
          <legend>Execution Behavior:</legend>
          <label>
            <input
              type="checkbox"
              name="encryptsData"
              checked={formData.executionBehavior.encryptsData}
              onChange={handleCheckboxChange}
            />
            File Encrypts Data
          </label>
          <label>
            <input
              type="checkbox"
              name="networkConnection"
              checked={formData.executionBehavior.networkConnection}
              onChange={handleCheckboxChange}
            />
            Establishes Network Connection
          </label>
          <label>
            <input
              type="checkbox"
              name="dropsExecutables"
              checked={formData.executionBehavior.dropsExecutables}
              onChange={handleCheckboxChange}
            />
            Drops Executables
          </label>
        </fieldset>
        <label>
          Network Activity:
          <input type="text" name="networkActivity" value={formData.networkActivity} onChange={handleInputChange} />
        </label>
        <div className="button-container">
          <button type="submit" disabled={loading}>Analyze</button>
          <button type="button" onClick={resetForm}>Reset</button>
        </div>
      </form>
      {loading && <p>Loading analysis...</p>}
      {error && <p className="error">{error}</p>}
      {result && (
        <div className="result-container">
          <h3>Analysis Result</h3>
          <p>{result.details}</p>
          <p><strong>Status:</strong> {result.isSuspicious ? 'Suspicious' : 'Clean'}</p>
        </div>
      )}
    </div>
  );
};

export default FileUpload;




