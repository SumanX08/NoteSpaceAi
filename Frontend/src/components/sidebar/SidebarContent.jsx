import { useAppStore } from "@/store/appStore";
import NotebookRow from "./NotebookRow";

export default function SidebarContent({
  notebooks,
  onRenameNotebook,
  onDeleteNotebook,
  onTogglePin,
}) {
  const activeNotebookId = useAppStore(
    (state) => state.activeNotebookId
  );

  const setActiveNotebookId = useAppStore(
    (state) => state.setActiveNotebookId
  );

  return (
    <div className="flex-1 overflow-y-auto px-3 py-2">
      <SectionLabel>Workspace</SectionLabel>

      <div className="space-y-1">
        {notebooks.map((notebook) => (
          <NotebookRow
            key={notebook.id}
            notebook={notebook}
            active={notebook.id === activeNotebookId}
            onSelect={() =>
              setActiveNotebookId(notebook.id)
            }
            onRename={onRenameNotebook}
            onDelete={onDeleteNotebook}
            onPin={onTogglePin}
          />
        ))}
      </div>
    </div>
  );
}

function SectionLabel({ children }) {
  return (
    <p className="px-2 pb-2 pt-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
      {children}
    </p>
  );
}