import React from "react";
import { Box, Chip, Avatar } from "@mui/material";

export default function MessageChip({ img, text, username }) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: 'center',
        my: 1,
        flexDirection: username === "Me" ? 'row-reverse' : 'row',
      }}>
      <Avatar alt="Remy Sharp"sx={{border: '#eee 2px solid', mr: 1, ml: 1}}>
        {username ? username.slice(0, 2) : "??"}
      </Avatar>
      <Box>
        <p 
        style={{
          fontSize: 12, marginLeft: 4, margin: 0, padding: 0,
          textAlign: username === "Me" ? 'right' : 'left',
        }}>
          {username || "Anonymous"}
        </p>
        <Chip label={text} color={username === "Me" ? "primary": "success"} />
      </Box>
    </Box>
  );
}
