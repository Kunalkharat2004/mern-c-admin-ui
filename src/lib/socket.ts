import { io } from "socket.io-client";

const domain = import.meta.env.VITE_WEB_SOCKET_URL;
const socket = io(domain);

socket.on("connect",()=>{
    console.log("User connected: ",socket.id);
})

socket.on("disconnect", () => {
  console.log("User disconnect",socket.id); // undefined
});

export default socket;