import React, { useState } from "react";
import {
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Badge,
} from "@mui/material";

export default function UsersList({ users = [], onSelectUser, newMessages }) {
  const [currentUser, setCurrentUser] = useState({});
  const selectUser = (user) => {
    setCurrentUser(user);
    onSelectUser(user);
  };
  return (
    <List>
      {users.map((user) => (
        <div
          style={{
            backgroundColor:
              currentUser.id === user.id ? "#122345" : "transparent",
          }}
          key={`user-${user.id}`}
          onClick={() => selectUser(user)}
        >
          <ListItem disablePadding>
            <ListItemButton component="a" href="#simple-list">
              {newMessages[user.id] ? (
                <Badge color="primary" badgeContent={newMessages[user.id]} max={99}>
                  <ListItemText primary={user.username} />
                </Badge>
              ) : (
                <ListItemText primary={user.username} />
              )}
            </ListItemButton>
          </ListItem>
        </div>
      ))}
    </List>
  );
}
