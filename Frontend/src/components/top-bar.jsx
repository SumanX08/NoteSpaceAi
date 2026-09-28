import {
  Search,
  Plus,
  ChevronDown,
  PanelRightClose,
  PanelRightOpen,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { useAppStore } from "@/store/appStore";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  searchMessages,
} from "@/services/chat.service";


export function TopBar({
  title,
  emoji,
  onAddSource,
  notebookId,
}) {
  const rightPanelOpen =
    useAppStore(
      (state) =>
        state.rightPanelOpen
    );

  const toggleRightPanel =
    useAppStore(
      (state) =>
        state.toggleRightPanel
    );

  const [
    searchQuery,
    setSearchQuery,
  ] = useState("");

  const [
    results,
    setResults,
  ] = useState([]);

  const [
    searching,
    setSearching,
  ] = useState(false);

  const [
    searchOpen,
    setSearchOpen,
  ] = useState(false);

  const searchRef =
    useRef(null);


  // ==========================================
  // SEARCH
  // ==========================================

  useEffect(() => {
    if (!notebookId) {
      setResults([]);
      return;
    }

    const query =
      searchQuery.trim();

    if (!query) {
      setResults([]);
      setSearching(false);
      return;
    }

    const timer =
      setTimeout(
        async () => {
          try {
            setSearching(true);

            const res =
              await searchMessages(
                notebookId,
                query
              );

            setResults(
              res?.data ?? []
            );
          } catch (error) {
            console.error(
              "Failed to search messages:",
              error
            );

            setResults([]);
          } finally {
            setSearching(false);
          }
        },
        300
      );

    return () =>
      clearTimeout(timer);

  }, [
    searchQuery,
    notebookId,
  ]);


  // ==========================================
  // CLOSE SEARCH ON ESC
  // ==========================================

  useEffect(() => {
    const handleKeyDown =
      (event) => {
        if (
          event.key === "Escape"
        ) {
          setSearchQuery("");
          setSearchOpen(false);
          setResults([]);
        }
      };

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () =>
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
  }, []);


  // ==========================================
  // FORMAT MESSAGE
  // ==========================================

  const getPreview =
    (message) => {
      const text =
        message?.content || "";

      return text.length > 100
        ? `${text.slice(0, 100)}...`
        : text;
    };


  return (
    <header className="relative flex h-14 shrink-0 items-center gap-3 border-b border-border px-5">

      {/* ================================= */}
      {/* NOTEBOOK TITLE */}
      {/* ================================= */}

      <div className="flex min-w-0 items-center gap-2">
        <span className="text-base">
          {emoji}
        </span>

        <h1 className="truncate text-[0.9375rem] font-semibold tracking-tight">
          {title}
        </h1>

        <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
      </div>


      <div className="mx-2 hidden h-5 w-px bg-border md:block" />


      {/* ================================= */}
      {/* SEARCH */}
      {/* ================================= */}

      <div
        ref={searchRef}
        className="relative hidden w-1/2 md:block"
      >

        <div
          className="
            flex
            h-10
            items-center
            gap-2
            rounded-lg
            border
            border-border
            bg-muted/40
            px-3
            text-[0.8125rem]
            text-muted-foreground
            transition-colors
            focus-within:border-primary/50
            focus-within:bg-muted
          "
        >

          <Search
            className="h-3.5 w-3.5 shrink-0"
          />

          <input
            value={searchQuery}
            onFocus={() =>
              setSearchOpen(true)
            }
            onChange={(event) =>
              setSearchQuery(
                event.target.value
              )
            }
            placeholder="Search in notebook..."
            className="
              min-w-0
              flex-1
              bg-transparent
              text-sm
              text-foreground
              outline-none
              placeholder:text-muted-foreground
            "
          />

          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery("");
                setResults([]);
              }}
              className="
                flex
                h-5
                w-5
                items-center
                justify-center
                rounded
                hover:bg-background
              "
            >
              <X className="h-3 w-3" />
            </button>
          )}

        </div>


        {/* ================================= */}
        {/* SEARCH RESULTS */}
        {/* ================================= */}

        {searchOpen &&
          searchQuery.trim() && (
            <div
              className="
                absolute
                left-0
                right-0
                top-12
                z-50
                overflow-hidden
                rounded-xl
                border
                border-border
                bg-popover
                shadow-elevated
              "
            >

              {searching ? (

                <div className="px-4 py-5 text-center text-xs text-muted-foreground">
                  Searching...
                </div>

              ) : results.length === 0 ? (

                <div className="px-4 py-5 text-center text-xs text-muted-foreground">
                  No messages found.
                </div>

              ) : (

                <div className="max-h-80 overflow-y-auto">

                  {results.map(
                    (message) => (

                      <button
                        key={message._id}
                        className="
                          flex
                          w-full
                          flex-col
                          gap-1
                          border-b
                          border-border
                          px-4
                          py-3
                          text-left
                          transition-colors
                          last:border-b-0
                          hover:bg-muted/60
                        "
                      >

                        <div className="flex items-center gap-2">

                          <span
                            className="
                              rounded-md
                              bg-muted
                              px-1.5
                              py-0.5
                              text-[0.625rem]
                              font-medium
                              uppercase
                              text-muted-foreground
                            "
                          >
                            {message.role}
                          </span>

                          <span className="text-[0.625rem] text-muted-foreground">
                            {message.createdAt
                              ? new Date(
                                  message.createdAt
                                ).toLocaleString()
                              : ""}
                          </span>

                        </div>

                        <p className="line-clamp-2 text-xs text-foreground">
                          {getPreview(
                            message
                          )}
                        </p>

                      </button>

                    )
                  )}

                </div>

              )}

            </div>
          )}

      </div>


      {/* ================================= */}
      {/* RIGHT SIDE */}
      {/* ================================= */}

      <div className="ml-auto flex items-center gap-1.5">

        <Button
          onClick={onAddSource}
          size="sm"
          className={cn(
            "h-8 gap-1.5 rounded-lg bg-primary px-3 text-[0.8125rem] font-medium text-primary-foreground",
            "shadow-glow transition-colors hover:bg-primary-hover"
          )}
        >
          <Plus className="h-3.5 w-3.5" />
          Add Source
        </Button>


        <Button
          variant="ghost"
          size="icon"
          onClick={
            toggleRightPanel
          }
          className="h-8 w-8 text-muted-foreground hover:text-foreground"
          title={
            rightPanelOpen
              ? "Hide panel"
              : "Show panel"
          }
        >
          {rightPanelOpen ? (
            <PanelRightClose className="h-4 w-4" />
          ) : (
            <PanelRightOpen className="h-4 w-4" />
          )}
        </Button>

      </div>

    </header>
  );
}