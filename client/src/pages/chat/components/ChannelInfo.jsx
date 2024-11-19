import React, { useState, useEffect, useCallback } from 'react';
import { useAppstore } from '@/store';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getColor } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { apiClient } from '@/lib/api-client';
import {
  GET_CHANNEL_MEMBERS,
  REMOVE_CHANNEL_MEMBERS,
  MAKE_CHANNEL_ADMIN,
  HOST,
  ADD_CHANNEL_MEMBERS,
  GET_ALL_CONTACTS_ROUTES,
} from '@/utils/constants';
import { UserPlus, Crown } from 'lucide-react';
import MultipleSelector from '@/components/multipleselect';
import { toast } from "sonner";

export default function ChannelInfo({ isOpen, onClose }) {
  const { selectedChatData, userInfo, closeChat } = useAppstore();
  const [members, setMembers] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAddMember, setShowAddMember] = useState(false);
  const [allContacts, setAllContacts] = useState([]);
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [isDataFetched, setIsDataFetched] = useState(false);
  const [admindetails, setAdmindetails] = useState(null);
  const fetchChannelMembers = useCallback(async (channelId) => {
    try {
      const response = await apiClient.get(`${GET_CHANNEL_MEMBERS}/${channelId}`, { withCredentials: true });
      setMembers(response.data.members);
      setIsAdmin(response.data.admin === userInfo.id);
      setAdmindetails(response.data.adminDetails || null);
    } catch (error) {
      console.error('Error fetching channel members:', error);
    }
  }, [userInfo.id]);

  const fetchAllContacts = useCallback(async () => {
    try {
      const response = await apiClient.get(GET_ALL_CONTACTS_ROUTES, { withCredentials: true });
      if (response && response.data) {
        setAllContacts(response.data.contacts);
      }
    } catch (error) {
      console.error('Error fetching contacts:', error);
    }
  }, []);
  useEffect(() => {
    if (isOpen && selectedChatData._id && !isDataFetched) {
      fetchChannelMembers(selectedChatData._id);
      fetchAllContacts();
      setIsDataFetched(true);
    }
  }, [isOpen, selectedChatData._id, fetchChannelMembers, fetchAllContacts, isDataFetched]);

  useEffect(() => {
    if (!isOpen) {
      setIsDataFetched(false);
    }
  }, [isOpen]);

  const handleRemoveMember = async (memberId) => {
    try {
      const response = await apiClient.delete(
        `${REMOVE_CHANNEL_MEMBERS}/${selectedChatData._id}/${memberId}`,
        { withCredentials: true }
      );
      if (userInfo.id === memberId) {
        closeChat();
      }
      setMembers(response.data.members);
      setIsAdmin(response.data.admin === userInfo.id);
      setAdmindetails(response.data.adminDetails || null);
    } catch (error) {
      console.error('Error removing member:', error);
    }
  };

  const handleTransferOwnership = async (newAdminId) => {
    try {
      const response = await apiClient.put(
        `${MAKE_CHANNEL_ADMIN}/${selectedChatData._id}/${newAdminId}`,
        { withCredentials: true }
      );
      setMembers(response.data.members);
      setIsAdmin(response.data.admin === userInfo.id);
      setAdmindetails(response.data.adminDetails || null);
    } catch (error) {
      console.error('Error transferring ownership:', error);
    }
  };

  const availableContacts = allContacts
    .filter((contact) => !members.some((member) => member._id === contact._id))
    .map((contact) => ({
      value: contact._id,
      label: `${contact.label}`, // Fallback for undefined names
      data: contact,
    }));

  const handleAddMembers = async () => {
    if (selectedContacts.length === 0) {
      alert('Please select at least one contact to add.');
      return;
    }
    try {
      // Map the selected contacts' values (IDs) to `newMemberIds`
      const newMemberIds = selectedContacts.map((contact) => contact.value);
      const response = await apiClient.put(
        `${ADD_CHANNEL_MEMBERS}/${selectedChatData._id}`,
        { newMemberIds },
        { withCredentials: true }
      );
      if (response && response.data) {
        setMembers(response.data.channel.members);
        setSelectedContacts([]); 
      }
      
    } catch (error) {
      toast.error("Member already present");
      setSelectedContacts([]); 
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-800 text-white">
        <DialogHeader>
          <DialogTitle>{selectedChatData.name} - Channel Info</DialogTitle>
        </DialogHeader>
        <div className="mt-4 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Members:</h3>
            {isAdmin && (
              <Button
                onClick={() => setShowAddMember(!showAddMember)}
                variant="outline"
                size="sm"
                className="bg-gray-700 hover:bg-gray-600"
              >
                <UserPlus className="mr-2 h-4 w-4" />
                Add Member
              </Button>
            )}
          </div>
          
          {showAddMember && (
            <div className="space-y-2">
              <MultipleSelector
                className=""
                defaultOptions={allContacts}
                placeholder="Search contacts"
                value={selectedContacts}
                onChange={setSelectedContacts}
                emptyIndicator={
                  <p className="text-center text-lg leading-10 text-gray-600">
                    No result found
                  </p>
                }
              />

              <Button onClick={handleAddMembers} className="w-full bg-purple-600 hover:bg-purple-700">
                Add Selected Members
              </Button>
            </div>
          )}
          <ul className="space-y-2 max-h-60 overflow-y-auto">
            {members.map((member) => (
              <li key={member._id} className="flex items-center justify-between">
                <div className="flex items-center">
                  <Avatar className="h-8 w-8 mr-2">
                    {member.image ? (
                      <AvatarImage src={`${HOST}/${member.image}`} alt={member.firstName} />
                    ) : (
                      <AvatarFallback className={getColor(member.color)}>
                        {member.firstName?.charAt(0)}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <span>
                    {`${member.firstName} ${member.lastName}`}
                    {member._id === selectedChatData.admin && (
                      <Crown className="inline-block ml-2 h-4 w-4 text-yellow-500" />
                    )}
                    {member._id === userInfo.id && ' (You)'}
                  </span>
                </div>
                {isAdmin && member._id !== userInfo.id && (
                  <div className="space-x-2">
                    <Button variant="destructive" size="sm" onClick={() => handleRemoveMember(member._id)}>
                      Remove
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleTransferOwnership(member._id)}
                      className="bg-gray-700 hover:bg-gray-600"
                    >
                      Make Admin
                    </Button>
                  </div>
                )}
              </li>
            ))}
            {/* Highlight the current admin */}
            {admindetails && (
              <li className="flex items-center justify-between">
                <div className="flex items-center">
                  <Avatar className="h-8 w-8 mr-2">
                    {admindetails.image ? (
                      <AvatarImage src={`${HOST}/${admindetails.image}`} alt="Admin" />
                    ) : (
                      <AvatarFallback className={getColor(admindetails.color)}>
                        {admindetails.firstName?.charAt(0)}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <span>
                    {`${admindetails.firstName} ${admindetails.lastName}`}
                    <Crown className="inline-block ml-2 h-4 w-4 text-yellow-500" />
                    <span className="text-sm text-gray-400"> (Admin)</span>
                  </span>
                </div>
              </li>
            )}
          </ul>

          {!isAdmin && (
            <Button variant="destructive" onClick={() => handleRemoveMember(userInfo.id)} className="w-full">
              Leave Channel
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
