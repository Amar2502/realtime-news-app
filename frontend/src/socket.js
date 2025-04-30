// socket.js
import { io } from "socket.io-client";
import { getUsername } from "./utils/getUsername";

// Get the username from localStorage or prompt
const username = getUsername();

// Connect to the server and pass the username
const socket = io("http://localhost:3000", {
  query: { username }, // Send the username as a query param to the server
});

socket.on('connect', () => {
  console.log('Connected to server with ID:', socket.id);  // Check if connection is successful
});

export default socket;
