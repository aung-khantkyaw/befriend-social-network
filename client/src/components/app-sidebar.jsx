import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { authService } from "@/services/authService";
import { beFriendService } from "@/services/beFriendService";

export function AppSidebar({ ...props }) {
  const { user } = authService();
  const { notifications } = beFriendService();

  const count = notifications?.filter((n) => n.isRead === false).length;

  const data = {
    user: {
      name: user?.name,
      username: user?.username,
      avatar: user?.profile,
    },
    navMain: [
      {
        title: "Home",
        url: "/",
      },
      {
        title: "Squads",
        url: "/squads",
        items: [
          {
            title: "Create Squad",
            url: "/squads/create",
          },
          {
            title: "My Squads",
            url: "/squads/my-squads",
          },
        ],
      },
      {
        title: "Channels",
        url: "/channels",
        items: [
          {
            title: "Create Channel",
            url: "/channels/create",
          },
          {
            title: "My Channels",
            url: "/channels/my-channels",
          },
        ],
      },
      {
        title: "Community",
        items: [
          {
            title: "Friend List",
            url: "/friends",
          },
          {
            title: "Chat",
            url: "/chat",
          },
          {
            title: "Notifications",
            url: "/notifications",
            count: (count > 0 && count) || null,
          },
        ],
      },
    ],
  };

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/">
                <div className="flex aspect-square size-10 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  {/* <Link className="size-6" /> */}
                  <span className="text-xl font-bold">BF</span>
                </div>
                <div className="grid flex-1 text-left text-xl leading-tight">
                  <span className="truncate font-extrabold">BeFriend</span>
                  <span className="truncate text-sm font-semibold">
                    Social Network
                  </span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        {/* <NavProjects projects={data.projects} />
        <NavSecondary items={data.navSecondary} className="mt-auto" /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
