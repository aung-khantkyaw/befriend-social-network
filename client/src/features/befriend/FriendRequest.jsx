import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { SidebarMenuButton } from "@/components/ui/sidebar";
import { useNavigate } from "react-router-dom";

export default function FriendRequest() {
  const navigate = useNavigate();
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between m-4">
        <h2 className="text-xl font-semibold">Friend Requests</h2>
        <button className="text-sm text-blue-500">See All</button>
      </div>
      <SidebarMenuButton
        size="lg"
        className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
      >
        <Avatar className="h-8 w-8 rounded-lg">
          <AvatarImage src="https://picsum.photos/200" alt="img" />
          <AvatarFallback className="rounded-lg font-bold">WT</AvatarFallback>
        </Avatar>
        <div
          className="grid flex-1 text-left text-sm leading-tight"
          onClick={() => navigate("/winminthant")}
        >
          <span className="truncate font-semibold">Wai Min Thant</span>
          <span className="truncate text-xs">@waiminthant</span>
        </div>
        <Button variant="blue">Accept</Button>
      </SidebarMenuButton>

      <SidebarMenuButton
        size="lg"
        className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
      >
        <Avatar className="h-8 w-8 rounded-lg">
          <AvatarImage src="https://picsum.photos/200" alt="img" />
          <AvatarFallback className="rounded-lg font-bold">WT</AvatarFallback>
        </Avatar>
        <div className="grid flex-1 text-left text-sm leading-tight">
          <span className="truncate font-semibold">Wai Min Thant</span>
          <span className="truncate text-xs">@waiminthant</span>
        </div>
        <Button variant="blue">Accept</Button>
      </SidebarMenuButton>
    </div>
  );
}
