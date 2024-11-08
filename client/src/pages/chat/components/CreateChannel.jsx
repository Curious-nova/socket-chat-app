import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { apiClient } from "@/lib/api-client";
import {
  CREATE_CHANNEL_ROUTE,
  GET_ALL_CONTACTS_ROUTES,
} from "@/utils/constants";
import { FaPlus } from "react-icons/fa";
import { useEffect, useState } from "react";
import { useAppstore } from "@/store";
import { Button } from "@/components/ui/button";
import MultipleSelector from "@/components/multipleselect";

const CreateChannel = () => {
  const { addChannel } = useAppstore();
  const [newChannelModel, setNewChannelModel] = useState(false);
  const [allContact, setAllContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState([]);
  const [channelName, setChannelName] = useState("");

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await apiClient.get(GET_ALL_CONTACTS_ROUTES, {
          withCredentials: true,
        });

        if (response && response.data) {
          setAllContacts(response.data.contacts);
        }
      } catch (error) {
        console.error("Error fetching contacts:", error);
      }
    };

    getData();
  }, []);

  const createChannel = async () => {
    if (channelName.trim() === "" || selectedContact.length === 0) {
      alert("Please provide a channel name and select at least one contact.");
      return;
    }

    try {
      const response = await apiClient.post(
        CREATE_CHANNEL_ROUTE,
        {
          name: channelName,
          members: selectedContact.map((contact) => contact.value),
        },
        { withCredentials: true }
      );

      if (response.status === 201) {
        setChannelName("");
        setSelectedContact([]);
        setNewChannelModel(false);
        addChannel(response.data.channel);
      }
    } catch (error) {
      console.log("Error creating channel:", error);
    }
  };

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <FaPlus
              className="text-neutral-400 font-light text-opacity-90 text-start hover:text-neutral-100 cursor-pointer transition-all duration-300"
              onClick={() => setNewChannelModel(true)}
            />
          </TooltipTrigger>
          <TooltipContent className="bg-[#1c1b1e] border-none mb-2 p-3 text-white">
            Create New Channel
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <Dialog open={newChannelModel} onOpenChange={setNewChannelModel}>
        <DialogContent className="bg-[#181920] border-none text-white w-[400px] h-[400px] flex flex-col ">
          <DialogHeader>
            <DialogTitle>Please Select details for new Channel</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <div>
            <Input
              placeholder="Channel name"
              className="rounded-lg p-6 bg-[#2c2e3b] border-none"
              onChange={(e) => setChannelName(e.target.value)}
              value={channelName}
            />
          </div>
          <div>
            <MultipleSelector
              className="rounded-lg bg-[#2c2e3b] border-none py-2 text-white"
              defaultOptions={allContact}
              placeholder="Search contacts"
              value={selectedContact}
              onChange={setSelectedContact}
              emptyIndicator={
                <p className="text-center text-lg leading-10 text-gray-600">
                  No result found
                </p>
              }
            />
          </div>

          <div>
            <Button
              className="w-full bg-purple-700 hover:bg-purple-900 transition-all duration-300"
              onClick={createChannel}
            >
              Create Channel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CreateChannel;
