import { useState } from 'react';
import "./App.css";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";

//import ChatPage from './Pages/ChatPage';
import ChatPage from './Pages/ChatPage/Index.js';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <ChatPage />
    </ThemeProvider>
  );
}

export default App;
