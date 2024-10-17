import React from "react";
import { getColor } from "@/lib/utils";
import { useAppstore } from "@/store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MdEdit } from "react-icons/md";
import { IoLogOutOutline } from "react-icons/io5";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useNavigate } from "react-router-dom";
import { apiClient } from "@/lib/api-client";
import { LOGOUT } from "@/utils/constants";

const ProfileInfo = () => {
  const navigate = useNavigate();
  const { userInfo, setUserInfo } = useAppstore();

  const logout = async () => {
    try {
      const apiResponse = await apiClient.post(LOGOUT, {}, { withCredentials: true });

      if (apiResponse.status === 200) {
        setUserInfo(null);
        navigate("/auth");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="absolute bottom-0 flex justify-between items-center px-10 w-full bg-[#2a2b33]">
      <div className="flex gap-3 items-center justify-center">
        <div className="w-12 h-12 relative">
          <Avatar className="h-12 w-12 rounded-full overflow-hidden">
            {userInfo.image ? (
              <AvatarImage
                src={userInfo.image}
                alt="Profile"
                className="object-cover"
              />
            ) : (
              <AvatarFallback
                className={`text-lg uppercase ${getColor(userInfo.color)}`}
              >
                {userInfo.firstName
                  ? userInfo.firstName.charAt(0)+userInfo.lastName.charAt(0).toUpperCase()
                  : userInfo.email.charAt(0)}
              </AvatarFallback>
            )}
          </Avatar>
        </div>
        <div>
          {userInfo.firstName && userInfo.lastName
            ? `${userInfo.firstName} ${userInfo.lastName}`
            : ""}
        </div>
      </div>
      <div className="flex gap-5">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <MdEdit onClick={() => navigate("/profile")} />
            </TooltipTrigger>
            <TooltipContent className="bg-[#1c1b1e] border-none text-white ">
              <p>Profile</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <IoLogOutOutline className="text-red-500" onClick={logout} />
            </TooltipTrigger>
            <TooltipContent className="bg-[#1c1b1e] border-none text-white ">
              <p>Logout</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div> 
    </div>
  );
};

export default ProfileInfo;
