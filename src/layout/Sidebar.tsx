import React from "react";
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Drawer,
} from "@mui/material";
import ImageIcon from "@mui/icons-material/Image";
import HistoryIcon from "@mui/icons-material/History";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();

  const navItems = [
    { text: "AI Generator", icon: <ImageIcon />, path: "/" },
    { text: "History", icon: <HistoryIcon />, path: "/history" },
  ];

  return (
    <Drawer
      variant="permanent"
      anchor="left"
      sx={{
        width: 240,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: 240,
          boxSizing: "border-box",
          backgroundColor: "#1f2937",
          color: "#fff",
        },
      }}
    >
      <div className="text-xl font-bold p-4">EventumAI</div>
      <List>
        {navItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              component={Link}
              to={item.path}
              selected={location.pathname === item.path}
              sx={{ color: "white" }}
            >
              <ListItemIcon sx={{ color: "white" }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;
