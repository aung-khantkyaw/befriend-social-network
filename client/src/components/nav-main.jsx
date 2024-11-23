import PropTypes from "prop-types";

import {
  SidebarContent,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { useNavigate } from "react-router-dom";
import { Badge } from "./ui/badge";

export function NavMain({ items }) {
  const navigate = useNavigate();
  return (
    <SidebarContent>
      <SidebarGroup>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild>
                {/* <a href={item.url} className="font-medium">
                  {item.title}
                </a> */}
                {item.url ? (
                  <button
                    onClick={() => navigate(item.url)}
                    className="font-medium"
                  >
                    {item.title}
                  </button>
                ) : (
                  <span className="font-medium">{item.title}</span>
                )}
              </SidebarMenuButton>
              {item.items?.length ? (
                <SidebarMenuSub>
                  {item.items.map((item) => (
                    <SidebarMenuSubItem key={item.title}>
                      <SidebarMenuSubButton
                        asChild
                        isActive={item.isActive}
                        className="w-full"
                      >
                        <button onClick={() => navigate(item.url)} className="flex justify-between">
                          {item.title}
                          {item.count && (
                            <Badge className="ml-2">{item.count}</Badge>
                          )}
                        </button>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              ) : null}
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroup>
    </SidebarContent>
  );
}

NavMain.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
      items: PropTypes.arrayOf(
        PropTypes.shape({
          title: PropTypes.string.isRequired,
          url: PropTypes.string.isRequired,
        })
      ),
    })
  ),
};
