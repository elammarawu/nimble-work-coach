import { Link, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, Mail, FileText, ListChecks, Lightbulb, Settings, Bot, MessageSquare, Info } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const items = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "AI Chat", url: "/chat", icon: MessageSquare },
  { title: "Email Generator", url: "/email", icon: Mail },
  { title: "Meeting Summarizer", url: "/meeting", icon: FileText },
  { title: "Task Planner", url: "/tasks", icon: ListChecks },
  { title: "Research", url: "/research", icon: Lightbulb },
  { title: "About", url: "/about", icon: Info },
];

export function AppSidebar() {
  const path = useRouterState({ select: (r) => r.location.pathname });

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center gap-2.5 px-2 py-3">
          <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl gradient-bg shadow-glow">
            <Bot className="h-5 w-5 text-white" />
          </div>
          <div className="flex min-w-0 flex-col leading-tight">
            <span className="truncate text-sm font-bold tracking-tight">Productivity AI</span>
            <span className="truncate text-[11px] text-muted-foreground">Workplace assistant</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground/70">
            Workspace
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const active = path === item.url;
                return (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton
                      asChild
                      isActive={active}
                      className="data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground"
                    >
                      <Link to={item.url} className="group flex items-center gap-2.5 rounded-lg">
                        <item.icon className={`h-4 w-4 transition-colors ${active ? "text-primary" : ""}`} />
                        <span className="font-medium">{item.title}</span>
                        {active && <span className="ml-auto h-1.5 w-1.5 rounded-full gradient-bg" />}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={path === "/settings"}>
              <Link to="/settings" className="flex items-center gap-2.5">
                <Settings className="h-4 w-4" />
                <span className="font-medium">Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
