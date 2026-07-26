import { motion } from "framer-motion";
import {
  MessageSquare,
  FileStack,
  GraduationCap,
  Podcast,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/appStore";

const tabs = [
  {
    id: "chat",
    label: "Chat",
    icon: MessageSquare,
  },
  {
    id: "sources",
    label: "Sources",
    icon: FileStack,
  },
  {
    id: "learn",
    label: "Learn",
    icon: GraduationCap,
  },
  {
    id: "podcast",
    label: "Podcast",
    icon: Podcast,
  },
];

export function NavTabs() {
  const activeTab = useAppStore((state) => state.activeTab);

  const setActiveTab = useAppStore((state) => state.setActiveTab);

  return (
    <div className="flex items-center gap-1 px-5 pt-3">
      <div className="inline-flex items-center gap-0.5 rounded-xl border border-border bg-muted/30 p-0.5">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "relative flex h-8 items-center gap-1.5 rounded-lg px-3 text-[0.8125rem] font-medium transition-colors",
                isActive
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {isActive && (
                <motion.span
                  layoutId="active-tab"
                  className="absolute inset-0 rounded-lg bg-background shadow-soft"
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 32,
                  }}
                />
              )}

              <Icon className="relative z-10 h-3.5 w-3.5" />

              <span className="relative z-10">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}