import React, { useEffect, useRef, useState } from "react";
import { GrAttachment } from "react-icons/gr";
import { RiEmojiStickerLine } from "react-icons/ri";
import { IoSend } from "react-icons/io5";
import EmojiPicker from "emoji-picker-react";
const MessageBar = () => {
  const emojiRef = useRef();
  const [message, setMessage] = useState("");
  const [emojiOpen, setEmojiOpen] = useState(false)

  const handleAddEmoji = (emoji) => {
    setMessage((msg)=>msg+emoji.emoji)
  }
  const handleSend = async() => {

  }

  useEffect(() => {
    function handleClickOutside(e){
      if(emojiRef.current && !emojiRef.current.contains(e.target))
      {
        setEmojiOpen(false)
      }
    }
    document.addEventListener("mousedown",handleClickOutside)

    return(
      document.removeEventListener("mousedow",handleClickOutside)
    )
  },[emojiRef])
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
        <button className='text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all'>
        <GrAttachment className="text-2xl" />
        </button>
        <div className="relative">
        <button className='text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all' onClick={() =>setEmojiOpen(true)}>

        <RiEmojiStickerLine className="text-2xl"/>
        </button>
        <div className="absolute bottom-16 right-0" ref={emojiRef}>
          <EmojiPicker theme="dark" open={emojiOpen} onEmojiClick={handleAddEmoji} autoFocusSearch={false} />
        </div>
        </div>
      </div>
      <button className='bg-red-500 rounded-md flex justify-center items-center p-5 hover:bg-red-700 focus:bg-red-700
       focus:border-none focus:outline-none focus:text-white duration-300 transition-all' onClick={handleSend}>
        <IoSend className="text-2xl" />
        </button>
    </div>
  );
};

export default MessageBar;
