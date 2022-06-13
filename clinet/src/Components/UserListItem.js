import React from "react";
import { Box, Avatar } from "@mui/material";

export default function MessageChip({ img, text, username }) {
  return (
    <Box sx={{ display: "flex", alignItems: 'center', my: 1 }}>
      <Avatar alt="Remy Sharp" src={img} sx={{border: '#eee 2px solid', mr: 1}}/>
      <Box>
        <span style={{fontSize: 16, marginLeft: 4}}>
          {username || "Anonymous"}
        </span>
      </Box>
    </Box>
  );
}
