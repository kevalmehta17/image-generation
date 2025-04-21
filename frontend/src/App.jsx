import { useState } from "react";
import axios from "axios";

function App() {
  const [prompt, setPrompt] = useState("");
  const [aspectRatio, setAspectRatio] = useState("1:1");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const generateImage = async () => {
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/generate", {
        prompt,
        aspectRatio,
      });
      setImageUrl(res.data.imageUrl);
    } catch (err) {
      alert("Image generation failed.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const downloadImage = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/download",
        { imageUrl },
        { responseType: "blob" }
      );

      const blobUrl = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = "generated-image.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      alert("Failed to download image.");
      console.error("Download error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#bbdce9] via-[#56a9c5] to-[#063143]  text-white p-6 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-6">🖼️ Image Generator</h1>

      <div className="flex flex-col gap-4 w-full max-w-md">
        <input
          type="text"
          className="p-3 rounded bg-gray-800 border border-gray-700"
          placeholder="Enter your prompt..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />

        <select
          value={aspectRatio}
          onChange={(e) => setAspectRatio(e.target.value)}
          className="p-3 mt-2 rounded bg-gray-800 border border-gray-700"
        >
          <option>1:1</option>
          <option>3:2</option>
          <option>16:9</option>
          <option>4:5</option>
          <option>2:3</option>
        </select>
        {/* "1:1": "1024x1024",
        "3:2": "768x512",
        "16:9": "1024x576",
        "4:5": "819x1024",
        "2:3": "682x1024" */}

        <button
          onClick={generateImage}
          className="bg-transparent text-black  hover:bg-slate-200 text-xl py-2 rounded font-semibold"
        >
          {loading ? "Generating..." : "Generate"}
        </button>
      </div>

      {imageUrl && (
        <div className="mt-8 flex flex-col items-center gap-4">
          <img
            src={imageUrl}
            alt="Generated"
            className="rounded-xl max-w-md border border-gray-700"
          />
          <div className="flex gap-4">
            <button
              onClick={downloadImage}
              className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded"
            >
              Download
            </button>
            <button
              onClick={() => setImageUrl("")}
              className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
