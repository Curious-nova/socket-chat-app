import React, { useEffect, useRef, useState } from "react"
import { GrAttachment } from "react-icons/gr"
import { RiEmojiStickerLine } from "react-icons/ri"
import { IoSend } from "react-icons/io5"
import EmojiPicker from "emoji-picker-react"
import { useAppstore } from "@/store"
import { useSocket } from "@/context/SocketContext"
import { apiClient } from "@/lib/api-client"
import { UPLOAD_FILE_ROUTE } from "@/utils/constants"
import CryptoJS from "crypto-js"

const SECRET_KEY = "socket-chat-app" // Replace with a strong key

// Function to encrypt a message
const encryptMessage = (message) => {
  return CryptoJS.AES.encrypt(message, SECRET_KEY).toString()
}

export default function Component() {
  const { selectedChatType, selectedChatData, userInfo, setIsUploading, setFileUploadProgress } = useAppstore()
  const fileInputRef = useRef()
  const socket = useSocket()
  const emojiRef = useRef()
  const [message, setMessage] = useState("")
  const [emojiOpen, setEmojiOpen] = useState(false)

  const handleAddEmoji = (emoji) => {
    setMessage((msg) => msg + emoji.emoji)
  }

  const handleSendMessage = async () => {
    if (!message.trim()) return // Avoid sending empty messages

    const encryptedMessage = encryptMessage(message) // Encrypt the message

    if (selectedChatType === "contact") {
      socket.emit("sendMessage", {
        sender: userInfo.id,
        content: encryptedMessage, // Send encrypted message
        recipient: selectedChatData._id,
        messageType: "text",
        fileUrl: undefined,
      })
    } else if (selectedChatType === "channel") {
      socket.emit("send-channel-message", {
        sender: userInfo.id,
        content: encryptedMessage, // Send encrypted message
        messageType: "text",
        fileUrl: undefined,
        channelId: selectedChatData._id,
      })
    }
    setMessage("")
  }

  useEffect(() => {
    function handleClickOutside(e) {
      if (emojiRef.current && !emojiRef.current.contains(e.target)) {
        setEmojiOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)

    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [emojiRef])

  const handleAttachmentClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleAttachmentChange = async (event) => {
    try {
      const file = event.target.files[0]
      if (file) {
        const formData = new FormData()
        formData.append("file", file)
        setIsUploading(true)
        const response = await apiClient.post(UPLOAD_FILE_ROUTE, formData, {
          withCredentials: true,
          onUploadProgress: (data) => {
            const progress = Math.floor((data.loaded * 100) / data.total)
            setFileUploadProgress(progress)
          },
        })

        if (response.status === 200 && response.data) {
          setIsUploading(false)
          if (selectedChatType === "contact") {
            socket.emit("sendMessage", {
              sender: userInfo.id,
              content: undefined,
              recipient: selectedChatData._id,
              messageType: "file",
              fileUrl: response.data.filePath,
            })
          } else if (selectedChatType === "channel") {
            socket.emit("send-channel-message", {
              sender: userInfo.id,
              content: undefined,
              messageType: "file",
              fileUrl: response.data.filePath,
              channelId: selectedChatData._id,
            })
          }
        }
      }
    } catch (error) {
      setIsUploading(false)
      console.log({ error })
    }
  }

  return (
    <div className="h-[10vh] bg-gradient-to-r from-gray-900 to-gray-800 flex justify-center items-center px-4 sm:px-6 lg:px-8">
      <div className="flex-1 flex bg-gray-700 rounded-lg shadow-lg ">
        <input
          type="text"
          className="flex-1 p-4 bg-transparent text-white placeholder-gray-400 focus:outline-none"
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <div className="flex items-center space-x-2 px-3">
          <button
            className="text-gray-400 hover:text-white focus:outline-none transition-colors duration-200"
            onClick={handleAttachmentClick}
          >
            <GrAttachment className="text-xl" />
          </button>
          <input type="file" className="hidden" ref={fileInputRef} onChange={handleAttachmentChange} />
          <div className="relative">
            <button
              className="text-gray-400 hover:text-white focus:outline-none transition-colors duration-200"
              onClick={() => setEmojiOpen(true)}
            >
              <RiEmojiStickerLine className="text-xl" />
            </button>
            <div className="absolute bottom-12 right-0 z-10" ref={emojiRef}>
              <EmojiPicker theme="dark" open={emojiOpen} onEmojiClick={handleAddEmoji} autoFocusSearch={false} />
            </div>
          </div>
        </div>
      </div>
      <button
        className="ml-4 bg-gradient-to-r from-red-500 to-pink-500 rounded-full p-3 text-white shadow-lg hover:from-red-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition-all duration-200"
        onClick={handleSendMessage}
      >
        <IoSend className="text-xl" />
      </button>
    </div>
  )
}
