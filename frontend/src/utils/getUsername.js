// utils/getUsername.js
export const getUsername = () => {
    let username = localStorage.getItem("username");
    if (!username) {
      username = prompt("Enter your name:").trim(); // Ask the user for their name
      if (username) {
        localStorage.setItem("username", username); // Store the username in localStorage
      }
    }
    return username; // Return the stored or newly entered username
  };
  