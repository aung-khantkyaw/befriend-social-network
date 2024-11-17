import PropTypes from "prop-types";

import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/toaster";
import Newsfeed from "@/pages/Newsfeed";
import SuggestSidebar from "@/components/suggest-sidebar";

export default function AuthLayout({ children }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>{children || <Newsfeed />}</SidebarInset>
      <SuggestSidebar />
      <Toaster />
    </SidebarProvider>
  );
}

AuthLayout.propTypes = {
  children: PropTypes.node.isRequired,
};
