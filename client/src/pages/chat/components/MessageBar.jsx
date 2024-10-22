import React, { useEffect, useRef, useState } from "react";
import { GrAttachment } from "react-icons/gr";
import { RiEmojiStickerLine } from "react-icons/ri";
import { IoSend } from "react-icons/io5";
import EmojiPicker from "emoji-picker-react";
import { useAppstore } from "@/store";
import { useSocket } from "@/context/SocketContext";
import { apiClient } from "@/lib/api-client";
import { UPLOAD_FILE_ROUTE } from "@/utils/constants";
import { data } from "autoprefixer";
const MessageBar = () => {
  const { selectedChatType, selectedChatData, userInfo,setIsUploading,setFileUploadProgress } = useAppstore();
  const fileInputRef = useRef();
  const socket = useSocket();
  const emojiRef = useRef();
  const [message, setMessage] = useState("");
  const [emojiOpen, setEmojiOpen] = useState(false)

  const handleAddEmoji = (emoji) => {
    setMessage((msg) => msg + emoji.emoji)
  }
  const handleSendMessage = async () => {
    if (selectedChatType === "contact") {
      socket.emit("sendMessage", {
        sender: userInfo.id,
        content: message,
        recipient: selectedChatData._id,
        messageType: "text",
        fileUrl: undefined,
      })
    }
  }

  useEffect(() => {
    function handleClickOutside(e) {
      if (emojiRef.current && !emojiRef.current.contains(e.target)) {
        setEmojiOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)

    return (
      document.removeEventListener("mousedow", handleClickOutside)
    )
  }, [emojiRef])

  const handleAttachmentClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }
  const handleAttachmentChange = async (event) => {
    try {
      const file = event.target.files[0];
      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        setIsUploading(true);
        const response = await apiClient.post(UPLOAD_FILE_ROUTE, formData, {
          withCredentials: true,
          onUploadProgress: data => {
            const progress = Math.floor((data.loaded * 100) / data.total); // Round down to nearest integer
            setFileUploadProgress(progress);
          }
        });
        
        if (response.status === 200 && response.data) {
        setIsUploading(false);
          if (selectedChatType === "contact") {
            socket.emit("sendMessage", {
              sender: userInfo.id,
              content: undefined,
              recipient: selectedChatData._id,
              messageType: "file",
              fileUrl: response.data.filePath,
            });
          }
        }
      }
    } catch (error) {
      setIsUploading(false);
      console.log({ error });
    }
  }
  return (
    <div className="h-[10vh] bg-[#1c1d25] flex justify-center items-center px-86">
      <div className="flex-1 flex bg-[#2a2b33] rounded-md items-center gap-5 pr-5">
        <input
          type="text"
          className="flex-1 p-5 bg-transparent rounded-md focus:border-none focus:outline-none"
          placeholder="Message here"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button className='text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all' onClick={handleAttachmentClick}>
          <GrAttachment className="text-2xl" />
        </button>
        <input type="file" className="hidden" ref={fileInputRef} onChange={handleAttachmentChange} />
        <div className="relative">
          <button className='text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all' onClick={() => setEmojiOpen(true)}>

            <RiEmojiStickerLine className="text-2xl" />
          </button>
          <div className="absolute bottom-16 right-0" ref={emojiRef}>
            <EmojiPicker theme="dark" open={emojiOpen} onEmojiClick={handleAddEmoji} autoFocusSearch={false} />
          </div>
        </div>
      </div>
      <button className='bg-red-500 rounded-md flex justify-center items-center p-5 hover:bg-red-700 focus:bg-red-700
       focus:border-none focus:outline-none focus:text-white duration-300 transition-all' onClick={handleSendMessage}>
        <IoSend className="text-2xl" />
      </button>
    </div>
  );
};

export default MessageBar;
