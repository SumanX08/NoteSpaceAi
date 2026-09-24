import {
  FileText,
  Globe,
  File,
  Mic,
  Files,
  ArrowDown,
} from "lucide-react";

const sources = [
  { name: "PDFs", icon: FileText },
  { name: "Websites", icon: Globe },
  { name: "Notes", icon: File },
  { name: "Transcripts", icon: Mic },
  { name: "Documents", icon: Files },
];

function KnowledgeSources() {
  return (
    <section
      className="
        relative
        overflow-hidden
        bg-[hsl(var(--background))]
        px-6
        py-[120px]
      "
    >
      {/* Background glow */}
      <div
        className="
          pointer-events-none
          absolute
          left-1/2
          top-0
          h-[450px]
          w-[800px]
          -translate-x-1/2
          rounded-full
          bg-[rgba(37,99,235,0.05)]
          blur-[120px]
        "
      />

      <div className="relative mx-auto max-w-[1100px]">

        {/* Heading */}
        <h2
          className="
            text-center
            text-[clamp(32px,5vw,52px)]
            font-extrabold
            leading-[1.1]
            tracking-[-1.5px]
            text-[hsl(var(--foreground))]
          "
        >
          Your knowledge shouldn't be scattered.
        </h2>

        {/* Sources */}
        <div className="mt-[72px] grid grid-cols-2 gap-5 md:grid-cols-5">
          {sources.map((source, index) => {
            const Icon = source.icon;
            const highlighted = index === 2;

            return (
              <div
                key={source.name}
                className={`
                  group
                  relative
                  overflow-hidden
                  rounded-[14px]
                  border
                  p-7
                  text-center
                  backdrop-blur-[24px]
                  transition-all
                  duration-300
                  ${
                    highlighted
                      ? `
                        border-[rgba(37,99,235,0.3)]
                        bg-[rgba(37,99,235,0.06)]
                        shadow-[0_0_30px_rgba(37,99,235,0.05)]
                      `
                      : `
                        border-[hsl(var(--border))]
                        bg-[hsl(var(--card))]
                        hover:border-[rgba(37,99,235,0.25)]
                        hover:bg-[rgba(255,255,255,0.05)]
                      `
                  }
                `}
              >
                {/* Hover glow */}
                <div
                  className="
                    pointer-events-none
                    absolute
                    -right-10
                    -top-10
                    h-24
                    w-24
                    rounded-full
                    bg-blue-500/[0.08]
                    blur-2xl
                    opacity-0
                    transition-opacity
                    duration-300
                    group-hover:opacity-100
                  "
                />

                {/* Icon */}
                <div
                  className={`
                    relative
                    mx-auto
                    flex
                    h-14
                    w-14
                    items-center
                    justify-center
                    rounded-xl
                    border
                    transition-colors
                    ${
                      highlighted
                        ? `
                          border-[rgba(37,99,235,0.3)]
                          bg-[rgba(37,99,235,0.1)]
                        `
                        : `
                          border-[hsl(var(--border))]
                          bg-[rgba(255,255,255,0.03)]
                          group-hover:border-[rgba(37,99,235,0.2)]
                        `
                    }
                  `}
                >
                  <Icon
                    size={24}
                    strokeWidth={1.5}
                    className={
                      highlighted
                        ? "text-[hsl(var(--primary-hover))]"
                        : "text-[hsl(var(--muted-foreground))]"
                    }
                  />
                </div>

                {/* Label */}
                <p
                  className={`
                    relative
                    mt-5
                    text-sm
                    font-medium
                    ${
                      highlighted
                        ? "text-[hsl(var(--foreground))]"
                        : "text-[hsl(var(--muted-foreground))]"
                    }
                  `}
                >
                  {source.name}
                </p>
              </div>
            );
          })}
        </div>

        {/* Arrow */}
        <div className="my-10 flex justify-center">
          <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--card))]">
            <ArrowDown
              size={17}
              strokeWidth={1.5}
              className="text-[hsl(var(--primary-hover))]"
            />
          </div>
        </div>

        {/* NoteSpace AI */}
        <div
          className="
            mx-auto
            max-w-md
            rounded-[14px]
            border
            border-[rgba(37,99,235,0.25)]
            bg-[rgba(37,99,235,0.06)]
            px-10
            py-7
            text-center
            shadow-[0_0_60px_rgba(37,99,235,0.08)]
            backdrop-blur-[24px]
          "
        >
          <h3 className="text-3xl font-bold text-[hsl(var(--foreground))]">
            Notespace{" "}
            <span className="text-[hsl(var(--primary-hover))]">
              AI
            </span>
          </h3>
        </div>

        {/* Bottom heading */}
        <h3 className="mt-10 text-center text-3xl font-semibold tracking-tight text-[hsl(var(--foreground))]">
          One intelligent workspace.
        </h3>

        <p className="mx-auto mt-5 max-w-3xl text-center text-[15px] leading-[1.7] text-[hsl(var(--muted-foreground))]">
          Stop jumping between documents, browser tabs, bookmarks, and notes.
          Bring your knowledge together and interact with it using natural
          language.
        </p>
      </div>
    </section>
  );
}

export default KnowledgeSources;