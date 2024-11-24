import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { diffForHumans } from "@/lib/utils";
import { beFriendService } from "@/services/beFriendService";
import { useCallback, useEffect, useState } from "react";

export default function Notification() {
  const { notifications = [], markAsRead } = beFriendService(); // Default to empty array

  const [readNotis, setReadNotis] = useState([]);
  const [unReadNotis, setUnReadNotis] = useState([]);

  const filterReadNotis = useCallback(() => {
    const readNotis = notifications.filter((noti) => noti.isRead);
    setReadNotis(readNotis);
  }, [notifications]);

  const filterUnReadNotis = useCallback(() => {
    const unReadNotis = notifications.filter((noti) => !noti.isRead);
    setUnReadNotis(unReadNotis);
  }, [notifications]);

  useEffect(() => {
    filterReadNotis();
    filterUnReadNotis();
  }, [notifications, filterReadNotis, filterUnReadNotis]);

  const handleMarkAsRead = (notiId) => {
    markAsRead(notiId);
    setUnReadNotis((prevNotis) =>
      prevNotis.filter((noti) => noti.id !== notiId)
    );
  };

  return (
    <>
      <Header page="Notifications" />
      <div className="container mx-auto px-6">
        <Tabs defaultValue="unread" className="max-w-4xl mx-auto">
          <div className="mb-4 flex justify-between">
            <TabsList>
              <TabsTrigger value="unread">Unread</TabsTrigger>
              <TabsTrigger value="read">Read</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="unread">
            {unReadNotis.map((noti) => (
              <div
                key={noti.id}
                className="list-group-item list-group-item-action  border rounded-md "
              >
                <div className="flex w-full justify-between items-center p-4">
                  <a href={noti.routeTo}>
                    <h5 className="mb-1 font-bold">
                      {noti.title}
                      {" | "}
                      <small className="text-gray-600">
                        {diffForHumans(noti.createdAt)}
                      </small>
                    </h5>

                    <p className="mb-1">{noti.message}</p>
                  </a>
                  <Button onClick={() => handleMarkAsRead(noti.id)}>
                    Make as read
                  </Button>
                </div>
              </div>
            ))}
          </TabsContent>
          <TabsContent value="read">
            {readNotis.map((noti) => (
              <div
                key={noti.id}
                className="list-group-item list-group-item-action  border rounded-md "
              >
                <div className="flex w-full justify-between items-center p-4">
                  <a href={noti.routeTo}>
                    <h5 className="mb-1 font-bold">
                      {noti.title}
                      {" | "}
                      <small className="text-gray-600">
                        {diffForHumans(noti.createdAt)}
                      </small>
                    </h5>

                    <p className="mb-1">{noti.message}</p>
                  </a>
                </div>
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
