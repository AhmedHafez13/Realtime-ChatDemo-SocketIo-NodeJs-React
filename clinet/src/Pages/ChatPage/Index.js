import React, { useEffect, useState, useRef } from "react";
import logo from "../../logo.svg";
import {
  IconButton,
  Box,
  TextField,
  Card,
  CardContent,
  Container,
} from "@mui/material";
import {
  TagFaces as TagFacesIcon,
  Send as SendIcon,
  DeleteOutlined as DeleteOutlinedIcon,
  Login as LoginIcon,
} from "@mui/icons-material";

import io from "socket.io-client";

import UsersList from "./UsersList";
import MessageChip from "../../Components/MessageChip";

const URL = "http://localhost:8080/";

const socket = io(URL);

let chatingWithId = null;

export default function HomePage() {
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [chatingWith, setChatingWith] = useState({}); // {id, username}
  chatingWithId = chatingWith.id;
  const [unseenMessages, setUnseenMessages] = useState({});

  const [messages, setMessages] = useState([]); // [{ message, username, chatingWith }]
  const [message, setMessage] = useState("");

  const [username, setUsername] = useState("");
  const [isSigned, setIsSigned] = useState(false);

  const chatContainer = useRef(null);

  useEffect(() => {
    socket.on("new-user", (newUser) => {
      console.log("new user is online:", newUser.username);
      setOnlineUsers((onlineUsers) => [...onlineUsers, newUser]);
    });

    socket.on("new-message", (message) => {
      //console.log("new message:", message);
      setMessages((messages) => [...messages, message]);
      console.log({chatingWith});
      console.log("chating with id: " + message.chatingWith.id);
      if (message.chatingWith.id !== chatingWithId) {
        setUnseenMessages(items => {
          //console.log("new unseen message from", message.username);
          //console.log("new unseen message id", message.chatingWith.id);

          let count = items[message.chatingWith.id] || 0;
          items[message.chatingWith.id] = count + 1;
          return items;
        });
      } else {
        scrollToLatestMessage();
      }
    });

    socket.on("user-disconnected", (message) => {
      console.log("user disconnected id:", message.id);
      setOnlineUsers((onlineUsers) => onlineUsers.filter((user) => user.id !== message.id));
    });

    socket.on("online-users", (message) => {
      console.log("sign in success, Online Users:", message.onlineUsers);
      setOnlineUsers(message.onlineUsers);
    });
  }, []);

  const handleSignin = () => {
    if (username) {
      setIsSigned(true);
      socket.emit("sign-in", { username });
    }
  }

  const handleOnSubmit = (event) => {
    event.preventDefault();
    sendMessage();
  };

  const sendMessage = () => {
    if (!message || !chatingWith.id) return;
    console.log("sending message:", message);
    socket.emit("message", { message, username, chatingWith });
    setMessages((messages) => [...messages, { message: {message}, username: "Me", chatingWith }]);
    setMessage("");
    console.log(chatContainer.current);
    scrollToLatestMessage();
  };

  const handleMessageChange = (event) => {
    setMessage(event.target.value);
  };

  const onSelectUser = (user) => {
    console.log(user);
    setChatingWith(user);
    if (unseenMessages[user.id]) {
      delete unseenMessages[user.id];
    }
  }

  const scrollToLatestMessage = () => {
    setTimeout(() => {
      chatContainer.current.scrollBy({
        top: 100,
        left: 0,
        behavior: 'smooth'
      }, 350);
    });
  }

  return (
    <Container maxWidth="md" sx={{ mt: 3 }}>
      <h3 style={{margin: 0, padding: 0}}>
        {(username && isSigned) ? `Hello ${username}` : `Please Signin`}
      </h3>
      {!isSigned ? (
        <Card sx={{ p: 2 }}>
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <h3 style={{ marginRight: 12 }}>Name:</h3>
              <TextField
                fullWidth
                id="input-with-icon-textfield"
                variant="standard"
                value={username}
                onChange={(e) => { setUsername(e.target.value) }}
              />
              <IconButton
                color="primary"
                aria-label="upload picture"
                component="span"
                onClick={() => { handleSignin() }}
              >
                <LoginIcon sx={{ m: 1 }} />
              </IconButton>
            </Box>
          </CardContent>
        </Card>
      ) : (
        <Box sx={{ display: "flex" }}>
          <Card sx={{ mr: 2, width: 180 }}>
            <CardContent>
              <h4 style={{margin: 0, color: "lightBlue"}}>Online Users</h4>
              <UsersList
                users={onlineUsers}
                onSelectUser={onSelectUser}
                newMessages={unseenMessages}
              />
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  p: 1,
                  mb: 2,
                  bgcolor: "#111",
                  borderRadius: 2,
                  overflow: "none",
                }}
              >
                <div ref={chatContainer} style={{ overflow: "auto", height: 400 }}>
                  {
                    messages.filter(mes => mes.chatingWith.id === chatingWith.id)
                      .map((message, index) => (
                        <MessageChip
                          key={`msg-${index}`}
                          img={logo}
                          text={message.message.message}
                          username={message.username}
                        />
                      ))
                  }
                </div>
              </Box>

              <form id="chatForm" onSubmit={handleOnSubmit}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <IconButton
                    color="primary"
                    aria-label="upload picture"
                    component="span"
                    onClick={() => { setMessages([]) }}
                  >
                    <DeleteOutlinedIcon sx={{ m: 1 }} />
                  </IconButton>
                  <IconButton
                    color="primary"
                    aria-label="upload picture"
                    component="span"
                  >
                    <TagFacesIcon sx={{ m: 1 }} />
                  </IconButton>
                  <TextField
                    fullWidth
                    id="input-with-icon-textfield"
                    variant="standard"
                    value={message}
                    onChange={handleMessageChange}
                  />
                  <IconButton
                    color="primary"
                    component="span"
                    onClick={(e) => { sendMessage() }}
                  >
                    <SendIcon sx={{ m: 1 }} />
                  </IconButton>
                </Box>
              </form>
            </CardContent>
          </Card>
        </Box>
      )}
    </Container>
  );
}
