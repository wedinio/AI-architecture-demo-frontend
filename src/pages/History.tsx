import React from "react";
import {
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
} from "@mui/material";
import Grid from "@mui/material/Grid";

const History = () => {
  const history = JSON.parse(localStorage.getItem("history") || "[]");

  return (
    <Box sx={{ ml: 30, p: 2 }}>
      <Typography variant="h5" className="mb-4 font-semibold">
        History
      </Typography>

      {history.length === 0 ? (
        <Typography>No history found.</Typography>
      ) : (
        <Grid container spacing={2}>
          {history.map((item: any, index: number) => (
            <Grid>
              <Card>
                <CardMedia
                  component="img"
                  height="180"
                  image={item.imageUrl}
                  alt={`Generated ${item.mode}`}
                />
                <CardContent>
                  <Typography variant="body2">{item.prompt}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    Mode: {item.mode} <br />
                    {new Date(item.timestamp).toLocaleString()}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default History;
