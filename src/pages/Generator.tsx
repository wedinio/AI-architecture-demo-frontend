import React, { useRef, useState } from "react";
import axios from "axios";
import { Box, Button, TextField, Typography, Paper } from "@mui/material";

function Generator() {
  const [prompt, setPrompt] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [lines, setLines] = useState<number[][]>([]);
  const [loading, setLoading] = useState(false);

  // ---------------- Generate Floor Plan Image ----------------
  const handleGenerate = async () => {
    if (!prompt) return alert("Enter a prompt");
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("prompt", prompt);
      const res = await axios.post(
        "http://127.0.0.1:8000/txt2floorplan",
        formData,
        { responseType: "blob" }
      );
      setPreviewUrl(URL.createObjectURL(res.data));
      setLines([]); // reset previous lines
    } catch (err) {
      console.error(err);
      alert("Error generating floor plan");
    } finally {
      setLoading(false);
    }
  };

  // ---------------- Convert Image to JSON Lines ----------------
  const handleConvertToJSON = async () => {
    if (!previewUrl) return alert("Generate a floor plan first");
    setLoading(true);
    try {
      const blob = await fetch(previewUrl).then(r => r.blob());
      const formData = new FormData();
      formData.append("image", blob, "floorplan.png");

      const res = await axios.post(
        "http://127.0.0.1:8000/img2json",
        formData
      );
      setLines(res.data.lines);
    } catch (err) {
      console.error(err);
      alert("Error converting to JSON");
    } finally {
      setLoading(false);
    }
  };

  // ---------------- Download DXF ----------------
  const handleDownloadDXF = async () => {
    if (lines.length === 0) return alert("Convert to JSON first");
    setLoading(true);
    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/json2dxf",
        { lines },
        { responseType: "blob" }
      );
      const url = URL.createObjectURL(res.data);
      const a = document.createElement("a");
      a.href = url;
      a.download = "floorplan.dxf";
      a.click();
    } catch (err) {
      console.error(err);
      alert("Error downloading DXF");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        AI 2D Floor Plan Generator
      </Typography>

      <TextField
        fullWidth
        multiline
        minRows={3}
        label="Enter floor plan prompt"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        sx={{ mb: 2 }}
      />

      <Button
        variant="contained"
        onClick={handleGenerate}
        disabled={loading}
        sx={{ mr: 2 }}
      >
        {loading ? "Generating..." : "Generate Floor Plan"}
      </Button>

      <Button
        variant="outlined"
        onClick={handleConvertToJSON}
        disabled={loading || !previewUrl}
        sx={{ mr: 2 }}
      >
        Convert to JSON
      </Button>

      <Button
        variant="contained"
        color="success"
        onClick={handleDownloadDXF}
        disabled={loading || lines.length === 0}
      >
        Download DXF
      </Button>

      {previewUrl && (
        <Paper sx={{ mt: 4, p: 2 }}>
          <img src={previewUrl} alt="Floor Plan" style={{ width: "100%" }} />
        </Paper>
      )}
    </Box>
  );
}

export default Generator;
