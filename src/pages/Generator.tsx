import React, { useRef, useState } from "react";
import axios from "axios";
import {
  Box,
  Tabs,
  Tab,
  TextField,
  Typography,
  Paper,
  Stack,
  Button,
  Divider,
} from "@mui/material";
import { SketchCanvas, SketchCanvasRef } from "../components/DrawingCanvas";
import ResultViewer from "../components/ResultViewer";

function Generator() {
  const [mode, setMode] = useState<"txt2img" | "img2img">("txt2img");
  const [prompt, setPrompt] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [resultUrl, setResultUrl] = useState<string>("");

  const canvasRef = useRef<SketchCanvasRef>(null);

  const handleGenerate = async () => {
    const formData = new FormData();
    formData.append("prompt", prompt);

    if (mode === "img2img") {
      if (imageFile) {
        formData.append("image", imageFile);
      } else if (canvasRef.current) {
        const blob = await canvasRef.current.getImageBlob();
        formData.append("image", blob, "canvas.png");
      } else {
        alert("Upload or draw a sketch.");
        return;
      }
    }

    const endpoint =
      mode === "txt2img"
        ? "http://localhost:8000/txt2img"
        : "http://localhost:8000/img2img";

    const res = await axios.post(endpoint, formData, {
      responseType: "blob",
    });

    const imageUrl = URL.createObjectURL(res.data);
    setResultUrl(imageUrl);

    const historyItem = {
      prompt,
      imageUrl,
      mode,
      timestamp: new Date().toISOString(),
    };

    const history = JSON.parse(localStorage.getItem("history") || "[]");
    history.unshift(historyItem);
    localStorage.setItem("history", JSON.stringify(history));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleGenerate();
    }
  };

  return (
    <Box sx={{ ml: { md: 30, xs: 0 }, p: 3, maxWidth: "800px", mx: "auto" }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        AI Architectural Generator
      </Typography>

      <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
        <Tabs
          value={mode}
          onChange={(e, v) => {
            setMode(v);
            setResultUrl("");
          }}
          variant="fullWidth"
          textColor="primary"
          indicatorColor="primary"
          sx={{ mb: 3 }}
        >
          <Tab label="Text to Image" value="txt2img" />
          <Tab label="Image to Image" value="img2img" />
        </Tabs>

        <TextField
          fullWidth
          multiline
          minRows={3}
          label="Enter your creative prompt"
          variant="outlined"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          sx={{ mb: 3 }}
        />

        {mode === "img2img" && (
          <Stack spacing={2} mb={3}>
            <Button variant="outlined" component="label">
              Upload Image
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              />
            </Button>
            <Typography variant="body2" color="text.secondary">
              or draw a sketch below:
            </Typography>
            <SketchCanvas ref={canvasRef} />
          </Stack>
        )}
      </Paper>

      {resultUrl && (
        <>
          <Divider sx={{ my: 4 }} />
          <Paper elevation={3} sx={{ p: 2, borderRadius: 3 }}>
            <Typography variant="h6" gutterBottom>
              Generated Image
            </Typography>
            <ResultViewer url={resultUrl} />
          </Paper>
        </>
      )}
    </Box>
  );
}

export default Generator;
