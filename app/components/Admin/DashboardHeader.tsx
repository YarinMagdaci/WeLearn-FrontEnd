"use client";

import { ThemeSwitcher } from "../../utils/ThemeSwitcher";
import {
  useGetAllNotificationsQuery,
  useUpdateNotificationStatusMutation,
} from "../../../redux/features/notifications/notificationsApi";
import React, { FC, useEffect, useState } from "react";
import { IoMdNotificationsOutline } from "react-icons/io";

import socketIO from "socket.io-client";
import { format } from "timeago.js";
const ENDPOINT = process.env.NEXT_PUBLIC_SOCKET_SERVER_URI || "";
const socketId = socketIO(ENDPOINT, { transports: ["websocket"] });

type Props = {
  open?: boolean;
  setOpen?: any;
};

const DashboardHeader: FC<Props> = ({ open, setOpen }) => {
  const { data, refetch } = useGetAllNotificationsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const [updateNotificationStatus, { isSuccess }] =
    useUpdateNotificationStatusMutation();

  const [notifications, setNotifications] = useState<any>([]);

  const [audio, setAudio] = useState<any>(null);

  if (typeof window !== "undefined") {
    setAudio(
      new Audio(
        "https://res.cloudinary.com/drziviyla/video/upload/v1704284765/mixkit-light-button-2580_usgkqg.wav"
      )
    );
  }

  const playerNotificationSound = () => {
    if (audio) {
      audio.play();
    }
  };

  useEffect(() => {
    if (data) {
      setNotifications(
        data.notifications.filter(
          (currentNotification: any) => currentNotification.status === "unread"
        )
      );
    }
    if (isSuccess) {
      refetch();
    }
    if (audio) {
      audio.load();
    }
  }, [audio, data, isSuccess, refetch]);

  useEffect(() => {
    socketId.on("newNotification", (data) => {
      refetch();
      playerNotificationSound();
    });
  }, [playerNotificationSound, refetch]);

  const handleNotificationStatusChange = async (id: string) => {
    await updateNotificationStatus(id);
  };

  return (
    <div className="w-full flex items-center justify-end p-6 fixed top-5 right-0">
      <ThemeSwitcher />
      <div
        className="relative cursor-pointer m-2"
        onClick={() => setOpen(!open)}
      >
        <div className="relative">
          <IoMdNotificationsOutline className="text-2xl cursor-pointer dark:text-white text-black" />
          <span className="absolute -top-2 -right-2 bg-[#3ccba0] rounded-full w-[20px] h-[20px] text-[12px] flex items-center justify-center text-white">
            {notifications && notifications.length}
          </span>
        </div>
      </div>
      {open && (
        <div className="w-[350px] h-[50vh] dark:bg-[#111C43] bg-white shadow-xl absolute top-16 z-10 rounded">
          <h5 className="text-center text-[20px] font-Poppins text-black dark:text-white p-3">
            Notifications
          </h5>
          {notifications &&
            notifications.map((currentNotification: any, index: number) => (
              <div
                key={currentNotification._id}
                className="dark:bg-[#2d3a4ea1] bg-[#00000013] font-Poppins border-b dark:border-b-[#ffffff47] border-b-[#000000f]"
              >
                <div className="w-full flex items-center justify-between p-2">
                  <p className="text-black dark:text-white">
                    {currentNotification.item}
                  </p>
                  <p
                    className="text-black darl:text-white cursor-pointer"
                    onClick={() =>
                      handleNotificationStatusChange(currentNotification._id)
                    }
                  >
                    Mark as Read
                  </p>
                </div>
                <p className="px-2 text-black dark:text-white">
                  {currentNotification.message}
                </p>
                <p className="p-2 text-black dark:text-white text-[14px]">
                  {format(currentNotification.createdAt)}
                </p>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};
export default DashboardHeader;
