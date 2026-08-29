import { LogOut } from "lucide-react";
import { useUser, useClerk } from "@clerk/react";

export default function SidebarFooter() {
  const { user } = useUser();
  const { signOut } = useClerk();

  const handleLogout = async () => {
    await signOut();
  };

  const fullName =
    user?.fullName ||
    user?.username ||
    "User";

  const email =
    user?.primaryEmailAddress?.emailAddress ||
    "";

  const initials = fullName
    .split(" ")
    .map((name) => name[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="border-t border-border p-3">
      <div className="flex w-full items-center gap-3 rounded-lg px-2 py-2">
        
        {/* Avatar */}
        {user?.imageUrl ? (
          <img
            src={user.imageUrl}
            alt={fullName}
            className="h-8 w-8 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-linear-to-br from-zinc-600 to-zinc-800 text-xs font-semibold text-white">
            {initials}
          </div>
        )}

        {/* User Info */}
        <div className="flex min-w-0 flex-1 flex-col items-start">
          <span className="truncate text-sm font-medium">
            {fullName}
          </span>

          <span className="truncate text-xs text-muted-foreground">
            {email}
          </span>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          title="Logout"
          className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-red-500"
        >
          <LogOut className="h-4 w-4" />
        </button>

      </div>
    </div>
  );
}