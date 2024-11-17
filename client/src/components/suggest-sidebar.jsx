import FriendRequest from "@/features/befriend/FriendRequest";
import { Sidebar, SidebarContent } from "./ui/sidebar";

export default function SuggestSidebar() {
  return (
    <Sidebar
      collapsible="none"
      className="sticky hidden lg:flex top-0 h-svh border-l"
    >
      <SidebarContent>
        <div>
          <div className="flex items-center justify-between m-4">
            <h2 className="text-xl font-semibold">Notifications</h2>
            <button className="text-sm text-blue-500">See All</button>
          </div>
        </div>
        <FriendRequest />
      </SidebarContent>
    </Sidebar>
  );
}
