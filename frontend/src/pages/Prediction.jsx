import React, { useState } from "react";
import Footer from "../components/Footer";

const Prediction = () => {
  const [image, setImage] = useState(null);
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [gradcamLoading, setGradcamLoading] = useState(false);
  const [gradcamData, setGradcamData] = useState(null);
  const [showGradcam, setShowGradcam] = useState(false);

  const API_URL = "http://127.0.0.1:5000";

  const handleImageUpload = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (!selectedFile.type.startsWith("image/")) {
        setError("Please select a valid image file.");
        return;
      }
      if (selectedFile.size > 5 * 1024 * 1024) {
        setError("File size should be less than 5MB.");
        return;
      }
      setImage(URL.createObjectURL(selectedFile));
      setFile(selectedFile);
      setError("");
      setResult(null);
      setGradcamData(null);
    }
  };

  const handlePredict = async () => {
    if (!file) {
      setError("Please upload an image first.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(`${API_URL}/predict`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      setResult({
        prediction: data.prediction,
        confidence: data.confidence,
        rawPrediction: data.raw_prediction,
      });
    } catch (error) {
      console.error("Prediction failed:", error);
      setError(`Error predicting the image: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleExplain = async () => {
    if (!file) {
      setError("Please upload an image first.");
      return;
    }

    setGradcamLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(`${API_URL}/gradcam`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      setGradcamData(data);
      setShowGradcam(true);
    } catch (error) {
      console.error("Grad-CAM failed:", error);
      setError(`Error generating explanation: ${error.message}`);
    } finally {
      setGradcamLoading(false);
    }
  };

  const clearSelection = () => {
    setImage(null);
    setFile(null);
    setResult(null);
    setError("");
    setGradcamData(null);
    setShowGradcam(false);
  };

  const getResultColor = (prediction) => {
    return prediction === "EDIBLE" ? "text-green-400" : "text-red-400";
  };

  const getConfidenceColor = (confidence) => {
    if (confidence > 0.7) return "text-green-400";
    if (confidence > 0.5) return "text-yellow-400";
    return "text-red-400";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] to-[#16213e]">
      {image && (
        <nav className="sticky top-0 z-50 bg-[#0f0f1a]/90 backdrop-blur-md border-b border-purple-500/30 px-4 py-3">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">MS</span>
              </div>
              <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                MycoScan
              </h1>
            </div>
            <button
              onClick={clearSelection}
              className="px-4 py-2 text-purple-300 hover:text-white transition-colors text-sm font-medium"
            >
              New Scan
            </button>
          </div>
        </nav>
      )}

      <div
        className={`flex flex-col items-center justify-center px-4 ${
          image ? "py-8" : "py-10 min-h-screen pt-20 md:pt-0"
        }`}
      >
        <div className="w-full max-w-2xl">
          {!image && (
            <div className="text-center mb-8">
              <h1 className="pb-6 text-4xl md:text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                MycoScan
              </h1>
              <p className="text-gray-300 text-lg md:text-xl">
                AI-powered mushroom classification for safety identification
              </p>
            </div>
          )}

          {/* Upload Section */}
          <div className="bg-[#0f0f1a] border-2 border-purple-500/30 rounded-2xl p-6 md:p-7 mb-6 backdrop-blur-sm">
            <div className="text-center">
              {!image ? (
                <div className="border-2 border-dashed border-purple-500/50 rounded-xl p-6 md:p-8 hover:border-purple-400 transition-colors">
                  <div className="text-purple-300 mb-4">
                    <svg
                      className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                    <h3 className="text-lg md:text-xl font-semibold mb-2">
                      Upload Mushroom Image
                    </h3>
                    <p className="text-gray-400 text-sm md:text-base">
                      Click to select or drag and drop
                    </p>
                  </div>
                  <label
                    htmlFor="file-upload"
                    className="inline-block px-4 py-2 md:px-6 md:py-3 bg-purple-600 text-white rounded-lg cursor-pointer hover:bg-purple-700 transition-colors text-sm md:text-base"
                  >
                    Choose File
                  </label>
                  <input
                    id="file-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="relative inline-block">
                    <img
                      src={image}
                      alt="Uploaded mushroom"
                      className="w-48 h-48 md:w-64 md:h-64 object-cover rounded-xl border-2 border-purple-500/50 shadow-lg"
                    />
                    <button
                      onClick={clearSelection}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 transition-colors"
                    >
                      ×
                    </button>
                  </div>
                  <p className="text-gray-300 text-sm md:text-base truncate max-w-xs mx-auto">
                    {file?.name}
                  </p>
                </div>
              )}
            </div>
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 mb-6">
              <p className="text-red-300 text-center text-sm md:text-base">
                {error}
              </p>
            </div>
          )}

          {image && (
            <div className="text-center mb-8">
              <button
                onClick={handlePredict}
                disabled={loading}
                className="w-full md:w-auto px-6 py-3 md:px-8 md:py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold text-base md:text-lg hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Analyzing...</span>
                  </div>
                ) : (
                  "Identify Mushroom"
                )}
              </button>
            </div>
          )}

          {result && (
            <div className="bg-[#0f0f1a] border border-purple-500/30 rounded-2xl p-4 md:p-6 backdrop-blur-sm mb-8">
              <h3 className="text-xl md:text-2xl font-bold text-center mb-6 text-purple-300">
                Prediction Results
              </h3>

              <div className="space-y-4">
                <div className="text-center">
                  <div
                    className={`text-xl md:text-2xl font-bold ${getResultColor(
                      result.prediction
                    )}`}
                  >
                    {result.prediction}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  <div className="bg-black/30 rounded-lg p-4 text-center">
                    <div className="text-gray-400 text-xs md:text-sm mb-1">
                      Confidence Score
                    </div>
                    <div
                      className={`text-lg md:text-xl font-semibold ${getConfidenceColor(
                        result.confidence
                      )}`}
                    >
                      {(result.confidence * 100).toFixed(2)}%
                    </div>
                  </div>

                  <div className="bg-black/30 rounded-lg p-4 text-center">
                    <div className="text-gray-400 text-xs md:text-sm mb-1">
                      Confidence Level
                    </div>
                    <div
                      className={`text-lg md:text-xl font-semibold ${getConfidenceColor(
                        result.confidence
                      )}`}
                    >
                      {result.confidence > 0.7
                        ? "High"
                        : result.confidence > 0.5
                        ? "Medium"
                        : "Low"}
                    </div>
                  </div>
                </div>

                {/* Explain Button */}
                <div className="mt-6">
                  <button
                    onClick={handleExplain}
                    disabled={gradcamLoading}
                    className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {gradcamLoading ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>Generating Explanation...</span>
                      </div>
                    ) : (
                      "How Did the Model Decide?"
                    )}
                  </button>
                </div>

                {result.prediction === "NON-EDIBLE" && (
                  <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 mt-4">
                    <div className="flex items-start space-x-3 text-red-300">
                      <div>
                        <div className="font-semibold text-sm md:text-base">
                          Safety Warning
                        </div>
                        <div className="text-xs md:text-sm">
                          This mushroom is predicted to be non-edible. Never
                          consume mushrooms without expert identification.
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {result.prediction === "EDIBLE" && (
                  <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-4 mt-4">
                    <div className="flex items-start space-x-3 text-yellow-300">
                      <div>
                        <div className="font-semibold text-sm md:text-base">
                          Caution
                        </div>
                        <div className="text-xs md:text-sm">
                          While predicted as edible, always consult with
                          mycology experts before consuming wild mushrooms.
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Grad-CAM Modal */}
      {showGradcam && gradcamData && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#0f0f1a] rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-purple-500/30">
            <div className="sticky top-0 bg-[#0f0f1a] border-b border-purple-500/30 flex justify-between items-center p-6">
              <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                How Did the Model Decide?
              </h2>
              <button
                onClick={() => setShowGradcam(false)}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <p className="text-gray-300 mb-4">
                  This mushroom was classified as{" "}
                  <span
                    className={`font-bold ${
                      gradcamData.prediction === "NON-EDIBLE"
                        ? "text-red-400"
                        : "text-green-400"
                    }`}
                  >
                    {gradcamData.prediction}
                  </span>{" "}
                  with{" "}
                  <span className="font-bold text-blue-400">
                    {(gradcamData.confidence * 100).toFixed(1)}%
                  </span>{" "}
                  confidence. The visualizations below show which parts of the
                  mushroom influenced this decision.
                </p>
              </div>

              {/* Visualizations Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <img
                    src={`data:image/png;base64,${gradcamData.visualizations.original}`}
                    alt="Original"
                    className="w-full rounded-lg border border-purple-500/30"
                  />
                  <p className="text-center text-gray-300 text-sm font-semibold">
                    Original Image
                  </p>
                </div>

                <div className="space-y-2">
                  <img
                    src={`data:image/png;base64,${gradcamData.visualizations.heatmap}`}
                    alt="Heatmap"
                    className="w-full rounded-lg border border-purple-500/30"
                  />
                  <p className="text-center text-gray-300 text-sm font-semibold">
                    Attention Heatmap
                  </p>
                </div>

                <div className="space-y-2">
                  <img
                    src={`data:image/png;base64,${gradcamData.visualizations.overlay}`}
                    alt="Overlay"
                    className="w-full rounded-lg border border-purple-500/30"
                  />
                  <p className="text-center text-gray-300 text-sm font-semibold">
                    Decision Overlay
                  </p>
                </div>
              </div>

              {/* Quadrant Analysis */}
              <div className="bg-black/30 rounded-lg p-4">
                <h3 className="text-lg font-bold text-purple-300 mb-4">
                  Model Focus by Region
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-[#1a1a2e] rounded p-3">
                    <p className="text-gray-400 text-xs mb-1">Top-Left</p>
                    <p className="text-blue-400 font-bold">
                      {(gradcamData.quadrants.top_left * 100).toFixed(1)}%
                    </p>
                  </div>
                  <div className="bg-[#1a1a2e] rounded p-3">
                    <p className="text-gray-400 text-xs mb-1">Top-Right</p>
                    <p className="text-blue-400 font-bold">
                      {(gradcamData.quadrants.top_right * 100).toFixed(1)}%
                    </p>
                  </div>
                  <div className="bg-[#1a1a2e] rounded p-3">
                    <p className="text-gray-400 text-xs mb-1">Bottom-Left</p>
                    <p className="text-blue-400 font-bold">
                      {(gradcamData.quadrants.bottom_left * 100).toFixed(1)}%
                    </p>
                  </div>
                  <div className="bg-[#1a1a2e] rounded p-3">
                    <p className="text-gray-400 text-xs mb-1">Bottom-Right</p>
                    <p className="text-blue-400 font-bold">
                      {(gradcamData.quadrants.bottom_right * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>
              </div>

              {/* Explanation */}
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                <h3 className="font-bold text-blue-400 mb-2">Understanding the Visualization</h3>
                <ul className="text-gray-300 text-sm space-y-2">
                  <li>
                    <span className="text-red-400 font-semibold">Red/Yellow areas:</span> The
                    model focused on these parts to make its decision
                  </li>
                  <li>
                    <span className="text-blue-400 font-semibold">Blue areas:</span> These
                    regions had little influence on the prediction
                  </li>
                  <li>
                    The heatmap shows which specific features (cap color, texture, gill
                    pattern, stem) the model used
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Prediction;