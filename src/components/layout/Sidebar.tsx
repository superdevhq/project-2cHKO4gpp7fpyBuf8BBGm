
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  Users,
  Dumbbell,
  Apple,
  MessageSquare,
  Calendar,
  Settings,
  HelpCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const Sidebar = () => {
  const location = useLocation();
  
  const navigation = [
    { name: "Dashboard", href: "/", icon: BarChart3 },
    { name: "Clients", href: "/clients", icon: Users },
    { name: "Workouts", href: "/workouts", icon: Dumbbell },
    { name: "Nutrition", href: "/nutrition", icon: Apple },
    { name: "Messaging", href: "/messaging", icon: MessageSquare },
    { name: "Calendar", href: "/calendar", icon: Calendar },
  ];

  const secondaryNavigation = [
    { name: "Settings", href: "/settings", icon: Settings },
    { name: "Help", href: "/help", icon: HelpCircle },
  ];

  return (
    <div className="hidden border-r bg-card md:flex md:w-64 md:flex-col">
      <div className="flex flex-col gap-2">
        <div className="flex h-16 items-center border-b px-6">
          <Link to="/" className="flex items-center gap-2 font-semibold">
            <Dumbbell className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">FitPro AI</span>
          </Link>
        </div>
        <div className="flex-1 overflow-auto py-2">
          <nav className="grid items-start px-2 text-sm font-medium">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
                  location.pathname === item.href
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </Link>
            ))}
          </nav>
          <div className="mt-6">
            <div className="px-4 text-xs font-semibold text-muted-foreground">
              Support
            </div>
            <nav className="mt-2 grid items-start px-2 text-sm font-medium">
              {secondaryNavigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
                    location.pathname === item.href
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>
        <div className="mt-auto border-t p-4">
          <div className="rounded-lg bg-primary/10 p-4">
            <h5 className="mb-2 font-medium text-primary">Upgrade to Pro</h5>
            <p className="mb-4 text-xs text-muted-foreground">
              Unlock AI workout generation and advanced analytics
            </p>
            <Button size="sm" className="w-full">
              Upgrade
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
