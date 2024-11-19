import React from 'react'
import { useAppstore } from '@/store'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getColor } from '@/lib/utils'
import { HOST } from '@/utils/constants'
import moment from 'moment'

const ContactList = ({ contacts, isChannel = false }) => {
  const { setSelectedChatData, setSelectedChatType } = useAppstore()

  const handleContactClick = (contact) => {
    setSelectedChatData(contact)
    setSelectedChatType(isChannel ? 'channel' : 'contact')
  }

  return (
    <ul className="space-y-2">
      {contacts.map((contact) => (
        <li
          key={contact._id}
          className="flex items-center space-x-3 p-2 hover:bg-gray-700 rounded-lg cursor-pointer transition-colors duration-200"
          onClick={() => handleContactClick(contact)}
        >
          <Avatar className="h-10 w-10">
            {contact.image ? (
              <AvatarImage src={`${HOST}/${contact.image}`} alt={contact.firstName} />
            ) : (
              <AvatarFallback className={getColor(contact.color)}>
                {isChannel ? contact.name.charAt(0).toUpperCase() : (contact.firstName?.charAt(0) || contact.email.charAt(0)).toUpperCase()}
              </AvatarFallback>
            )}
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-200 truncate">
              {isChannel ? contact.name : `${contact.firstName} ${contact.lastName}`}
            </p>
            {contact.lastMessage && (
              <p className="text-xs text-gray-400 truncate">{contact.lastMessage}</p>
            )}
          </div>
          {contact.lastMessageTime && (
            <span className="text-xs text-gray-500">
              {moment(contact.lastMessageTime).fromNow()}
            </span>
          )}
        </li>
      ))}
    </ul>
  )
}

export default ContactList