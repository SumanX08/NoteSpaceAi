import SidebarHeader from "./SidebarHeader";
import SidebarContent from "./SidebarContent";
import SidebarFooter from "./SidebarFooter";

export default function Sidebar({
  notebooks,
  onCreateNotebook,
  onRenameNotebook,
  onDeleteNotebook,
  onTogglePin,
}) {
  return (
    <aside className="flex h-full w-64 flex-col border-r border-border bg-background">
      <SidebarHeader
        onCreateNotebook={onCreateNotebook}
      />

      <SidebarContent
        notebooks={notebooks}
        onRenameNotebook={onRenameNotebook}
        onDeleteNotebook={onDeleteNotebook}
        onTogglePin={onTogglePin}
      />

      <SidebarFooter />
    </aside>
  );
}