import Header from "@/components/Header";
import { diffForHumans } from "@/lib/utils";
import { beFriendService } from "@/services/beFriendService";

export default function Notification() {
  const { notifications } = beFriendService();

  console.log(notifications);

  return (
    <>
      <Header page="Notifications" />
      <div className="container mx-auto px-6">
        <h1>Notifications</h1>
        <div className="list-group">
          {notifications?.map((noti) => (
            <div
              key={noti.id}
              className="list-group-item list-group-item-action"
            >
              <div className="d-flex w-100 justify-content-between">
                <h5 className="mb-1">{noti.title}</h5>
                <small>{diffForHumans(noti.createdAt)}</small>
              </div>
              <p className="mb-1">{noti.message}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
