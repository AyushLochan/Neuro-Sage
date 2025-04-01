import React, { useState } from 'react';
import { Brain, Upload, History, AlertCircle, CheckCircle2 } from 'lucide-react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;
const CLASS_LABELS = ['mildly demented', 'moderately demented', 'non demented', 'very mildly demented'];

interface ScanHistory {
  id: string;
  date: string;
  prediction: string;
  confidence: number;
  imageUrl: string;
}

function PredictionPage() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [prediction, setPrediction] = useState<string | null>(null);
  const [probability, setProbability] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<ScanHistory[]>([]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please upload an image file.');
        return;
      }
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      setPrediction(null);
      setProbability(null);
      setError(null);
    }
  };

  const handleSubmit = async () => {
    if (!selectedImage) return;

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', selectedImage);

    try {
      const response = await axios.post(API_URL, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('API Response:', response.data);

      if (response.data && typeof response.data.label === 'number') {
        const labelIndex = response.data.label;
        if (labelIndex >= 0 && labelIndex < CLASS_LABELS.length) {
          const predictedLabel = CLASS_LABELS[labelIndex];
          setPrediction(predictedLabel);
          setProbability(response.data.probability);

          const newScan: ScanHistory = {
            id: Date.now().toString(),
            date: new Date().toLocaleString(),
            prediction: predictedLabel,
            confidence: response.data.probability,
            imageUrl: previewUrl!,
          };
          setHistory(prev => [newScan, ...prev]);
        } else {
          setError('Invalid prediction result received from the server.');
        }
      } else {
        setError('Invalid response format from the server.');
      }
    } catch (err) {
      console.error('API Error:', err);
      if (axios.isAxiosError(err)) {
        if (err.response) {
          setError(`Server error: ${err.response.status} - ${err.response.statusText}`);
        } else if (err.request) {
          setError('No response received from the server. Please check your connection.');
        } else {
          setError('Error setting up the request. Please try again.');
        }
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fadeIn px-4 sm:px-6 md:px-8 py-6 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 lg:gap-8">
        {/* Upload Section */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 sm:p-6 shadow-xl transition-all duration-300 hover:shadow-2xl hover:bg-gray-800/60">
          <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 flex items-center gap-2">
            <Upload className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400 animate-bounce" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
              Upload Brain Scan
            </span>
          </h2>
          
          <div className="border-2 border-dashed border-gray-600 rounded-lg p-4 sm:p-6 md:p-8 text-center transition-all duration-300 hover:border-blue-400">
            <input
              accept="image/*"
              className="hidden"
              id="image-upload"
              type="file"
              onChange={handleImageUpload}
            />
            <label
              htmlFor="image-upload"
              className="cursor-pointer block"
            >
              {previewUrl ? (
                <div className="transition-opacity duration-500 opacity-100">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="max-h-40 sm:max-h-48 md:max-h-64 mx-auto rounded-lg shadow-lg transition-transform duration-300 hover:scale-105"
                  />
                  <p className="mt-3 text-xs sm:text-sm text-gray-400">Click to upload a different image</p>
                </div>
              ) : (
                <div className="py-6 sm:py-8 md:py-12 transition-all duration-300 hover:scale-105">
                  <Brain className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 text-gray-500 transition-colors duration-300 hover:text-blue-400" />
                  <p className="text-xs sm:text-sm text-gray-400">Tap to upload brain scan image</p>
                </div>
              )}
            </label>
          </div>

          {selectedImage && !loading && (
            <button
              onClick={handleSubmit}
              className="w-full mt-4 sm:mt-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 sm:py-3 px-4 sm:px-6 rounded-lg font-medium transition-all duration-300 hover:from-blue-600 hover:to-purple-700 hover:shadow-lg hover:shadow-blue-500/20 transform hover:-translate-y-1 active:translate-y-0 focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 focus:outline-none"
            >
              <span className="flex items-center justify-center gap-2">
                <Brain className="w-4 h-4 sm:w-5 sm:h-5" />
                Analyze Scan
              </span>
            </button>
          )}
        </div>

        {/* Results Section - Always visible */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 sm:p-6 shadow-xl transition-all duration-300 hover:shadow-2xl hover:bg-gray-800/60">
          <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 flex items-center gap-2">
            <Brain className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400 animate-pulse" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
              Analysis Results
            </span>
          </h2>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-8 sm:py-12">
              <div className="relative w-12 h-12 sm:w-16 sm:h-16">
                <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-blue-400/20"></div>
                <div className="absolute top-0 left-0 w-full h-full rounded-full border-t-4 border-blue-400 animate-spin"></div>
              </div>
              <p className="mt-4 text-sm text-gray-400">Analyzing brain scan...</p>
            </div>
          ) : error ? (
            <div className="animate-fadeIn bg-red-900/30 border border-red-500/50 rounded-lg p-3 sm:p-4 flex items-start gap-2 sm:gap-3 transition-all duration-300 hover:bg-red-900/40">
              <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-400 flex-shrink-0 mt-0.5 animate-pulse" />
              <p className="text-xs sm:text-sm text-red-400">{error}</p>
            </div>
          ) : prediction ? (
            <div className="space-y-4 sm:space-y-6 animate-fadeIn">
              <div className="bg-green-900/30 border border-green-500/50 rounded-lg p-3 sm:p-4 flex items-start gap-2 sm:gap-3 transition-all duration-300 hover:bg-green-900/40 transform hover:scale-105">
                <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-400 flex-shrink-0 mt-0.5 animate-pulse" />
                <div>
                  <h3 className="font-medium text-sm sm:text-base text-green-400">Diagnosis</h3>
                  <p className="text-xl sm:text-2xl font-semibold mt-1">{prediction}</p>
                </div>
              </div>

              {probability && (
                <div className="animate-fadeIn transition-all duration-300 hover:transform hover:scale-105">
                  <h3 className="text-sm sm:text-base text-gray-400 mb-2">Confidence Score</h3>
                  <div className="h-3 sm:h-4 bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-1000 ease-out"
                      style={{ width: `${probability * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-right mt-1 text-xs sm:text-sm text-gray-400">
                    {(probability * 100).toFixed(1)}%
                  </p>
                </div>
              )}

              <div className="border-t border-gray-700 pt-3 sm:pt-4 animate-fadeIn">
                <h3 className="text-sm sm:text-base text-gray-400 mb-2 sm:mb-3">Recommendations</h3>
                <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm">
                  <li className="flex items-center gap-2 transition-all duration-300 hover:text-blue-400">
                    <CheckCircle2 className="w-3 h-3 sm:w-4 sm:h-4 text-green-400" />
                    Consult with a neurologist for detailed evaluation
                  </li>
                  <li className="flex items-center gap-2 transition-all duration-300 hover:text-blue-400">
                    <CheckCircle2 className="w-3 h-3 sm:w-4 sm:h-4 text-green-400" />
                    Schedule regular follow-up scans
                  </li>
                  <li className="flex items-center gap-2 transition-all duration-300 hover:text-blue-400">
                    <CheckCircle2 className="w-3 h-3 sm:w-4 sm:h-4 text-green-400" />
                    Consider cognitive enhancement exercises
                  </li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 sm:py-12 text-gray-400">
              <div className="flex flex-col items-center justify-center">
                <Brain className="w-12 h-12 sm:w-16 sm:h-16 text-gray-600 mb-3 sm:mb-4 animate-pulse" />
                <p className="text-sm">Upload a brain scan to begin analysis</p>
                <p className="text-xs sm:text-sm text-gray-500 mt-2">Results will appear here</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* History Section */}
      {history.length > 0 && (
        <div className="mt-8 sm:mt-10 md:mt-12 animate-fadeIn">
          <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 flex items-center gap-2">
            <History className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
              Scan History
            </span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {history.map((scan, index) => (
              <div 
                key={scan.id} 
                className="bg-gray-800/50 backdrop-blur-sm rounded-lg overflow-hidden shadow-xl transition-all duration-300 hover:shadow-2xl hover:bg-gray-800/60 hover:-translate-y-1"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="overflow-hidden">
                  <img 
                    src={scan.imageUrl} 
                    alt="Scan" 
                    className="w-full h-32 sm:h-40 md:h-48 object-cover transition-transform duration-300 hover:scale-110" 
                  />
                </div>
                <div className="p-3 sm:p-4">
                  <div className="flex justify-between items-start mb-1 sm:mb-2">
                    <div>
                      <h3 className="font-medium text-sm sm:text-base">{scan.prediction}</h3>
                      <p className="text-xs sm:text-sm text-gray-400">{scan.date}</p>
                    </div>
                    <span className="bg-blue-500/20 text-blue-400 text-xs sm:text-sm px-1.5 sm:px-2 py-0.5 sm:py-1 rounded transition-colors duration-300 hover:bg-blue-500/30">
                      {(scan.confidence * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default PredictionPage;