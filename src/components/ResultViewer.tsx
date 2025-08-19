import React from "react";

interface ResultViewerProps {
  url: string | null;
}

const ResultViewer: React.FC<ResultViewerProps> = ({ url }) => {
  if (!url) return null; // or show placeholder

  return <img src={url} alt="Generated result" className="w-full mt-4" />;
};

export default ResultViewer;
