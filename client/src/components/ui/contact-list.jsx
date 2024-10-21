import { useAppstore } from '@/store'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getColor } from "@/lib/utils";
import React from 'react'

const ContactList = ({contacts,isChannel = false}) => {
  const {selectedChatData,setSelectedChatData,setSelectedChatType,selectedChatType,setSelectedChatMessages} = useAppstore();
  const handleClick = (contact) =>{
    if(isChannel) setSelectedChatType("channel");
    else setSelectedChatType("contact");
    setSelectedChatData(contact);
    if(selectedChatData && selectedChatData._id !== contact._id){
        setSelectedChatMessages([]);
    }

  };
    return (
    <div className='mt-5'>
      {contacts.map((contact)=>{
        <div key={contact._id} className={`pl-10 py-2 transition-all duration-300 cursor-pointer ${selectedChatData && selectedChatData._id=== contact._id ? "bg-[#8417ff] hover:bg-[#8417ff] " : "hover:bg-[#f1f111]"}`} onClick={()=> handleClick(contact)} >
            <div className='flex gap-5 items-center justify-start text-neutral-300'>
                {
                    !isChannel && <Avatar className="h-10 w-10 rounded-full overflow-hidden">
                    {contact.image ? (
                      <AvatarImage
                        src={contact.image}
                        alt="Profile"
                        className="object-cover w-full h-full bg-black" 
                      />
                    ) : (
                      <div
                        className={`uppercase h-10 w-10 border-[1px] text-lg flex items-center justify-center rounded-full ${getColor(contact.color)}`}
                      >
                        {contact.firstName
                          ? contact.firstName.split("").shift() + contact.lastName.split("").shift()
                          : contact.email.split("").shift()}
                      </div>
                    )}
                  </Avatar>
                }
                
            </div>
        </div>
      })}
    </div>
  )
}

export default ContactList
