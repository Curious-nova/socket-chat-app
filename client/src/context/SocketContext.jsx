import { useAppstore } from "@/store";
import { HOST } from "@/utils/constants";
import {  createContext,useContext,useEffect,useRef } from "react";
import {io} from "socket.io-client";

const SocketContext = createContext(null);

export const useSocket = () =>{
    return useContext(SocketContext);
}

export const SocketProvider = ({children})=>{
    const socket=useRef();
    const {userInfo,addMessage}= useAppstore();

    useEffect(()=>{
        if(userInfo){
            socket.current=io(HOST,{withCredentials:true,
            query:{userId:userInfo.id},
        });
        socket.current.on("connect",()=>{
            console.log("Connected to socket sever")
        });

        const handleRecieveMessage = (message) => {
            const {selectedChatData,selectedChatType} = useAppstore.getState();
            if(
                selectedChatType!==undefined && 
                (selectedChatData._id===message.sender._id || selectedChatData._id===message.recipient._id)
            ) {
                console.log("message rcv")
                addMessage(message);
            }
        };
        socket.current.on("recieveMessage",handleRecieveMessage);
        return ()=>{
            socket.current.disconnect();
        }
        }
    },[userInfo])

    return(
        <SocketContext.Provider value={socket.current}>
            {children}
        </SocketContext.Provider>
    )
};

// import { useAppstore } from "@/store";
// import { HOST } from "@/utils/constants";
// import { createContext, useContext, useEffect, useRef } from "react";
// import { io } from "socket.io-client";

// const SocketContext = createContext(null);

// export const useSocket = () => {
//     return useContext(SocketContext);
// }

// export const SocketProvider = ({ children }) => {
//     const socket = useRef();
//     const { userInfo, addMessage } = useAppstore();

//     useEffect(() => {
//         if (userInfo) {
//             socket.current = io(HOST, {
//                 withCredentials: true,
//                 query: { userId: userInfo.id },
//             });

//             socket.current.on("connect", () => {
//                 console.log("Connected to socket server");
//             });

//             const handleRecieveMessage = (message) => {
//                 const { selectedChatData, selectedChatType } = useAppstore.getState();
//                 console.log(selectedChatData)
//                 console.log(selectedChatType)

//                 if (
//                     selectedChatType !== undefined && 
//                     selectedChatData !== undefined && 
//                     message.sender !== undefined && 
//                     message.recipient !== undefined &&
//                     (selectedChatData._id === message.sender._id || selectedChatData._id === message.recipient._id)
//                 ) {
//                     console.log("Message received");
//                     addMessage(message);
//                 }
//             };

//             socket.current.on("recieveMessage", handleRecieveMessage);

//             return () => {
//                 socket.current.disconnect();
//             };
//         }
//     }, [userInfo]);

//     return (
//         <SocketContext.Provider value={socket.current}>
//             {children}
//         </SocketContext.Provider>
//     );
// };
