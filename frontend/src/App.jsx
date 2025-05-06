import React, { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [result, setResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      setResult(""); // Clear previous result
    }
  };

  const handleUpload = async () => {
    if (!image) return;

    setIsLoading(true);
    const formData = new FormData();
    formData.append("image", image);

    try {
      const response = await axios.post("http://localhost:5000/upload", formData);
      setResult(response.data.prediction);
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-container">
      <div className="square-card">
        {isLoading && (
          <div className="loading-overlay">
            <div className="loading-spinner"></div>
            <p className="loading-text">Analyzing image...</p>
          </div>
        )}

        {previewUrl ? (
          <div className="image-container">
            <img 
              src={previewUrl} 
              alt="Preview" 
              className="uploaded-image" 
            />
          </div>
        ) : (
          <div className="upload-interface">
            <input 
              type="file" 
              id="file-upload" 
              className="file-input" 
              accept="image/*" 
              onChange={handleFileChange} 
            />
            <label htmlFor="file-upload" className="custom-file-button">
              Choose Image
            </label>
          </div>
        )}

        {previewUrl && !isLoading && (
          <button 
            className="upload-button" 
            onClick={handleUpload}
            disabled={isLoading}
          >
            Predict
          </button>
        )}

        {result && (
          <div className="result-display">
            <h3>Result: {result}</h3>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;