import {
  Search,
  FileText,
  Globe,
  Mic,
  Bot,
  Bell,
  Plus,
  ChevronDown,
  PanelRight,
  Quote,
} from "lucide-react";

function ProductPreview() {
  return (
    <section className="relative overflow-hidden bg-[#030405] px-6 pb-32">
      {/* Background glow */}
      <div className="pointer-events-none absolute left-1/2 top-10 h-[550px] w-[900px] -translate-x-1/2 rounded-full bg-blue-600/[0.07] blur-[140px]" />

      <div className="relative mx-auto max-w-[1200px]">

        {/* Preview glow */}
        <div className="pointer-events-none absolute -inset-8 rounded-[32px] bg-blue-600/[0.04] blur-3xl" />

        {/* App window */}
        <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#05070A] shadow-[0_35px_100px_rgba(0,0,0,0.65)]">

          {/* Browser / window chrome */}
          <div className="flex h-10 items-center border-b border-white/[0.06] bg-[#080B10] px-4">

            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F57]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#FEBC2E]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#28C840]" />
            </div>

            <div className="mx-auto flex h-6 w-[280px] items-center justify-center rounded-md border border-white/[0.05] bg-white/[0.025]">
              <span className="text-[10px] text-slate-600">
                notespace-ai.vercel.app
              </span>
            </div>

            <div className="w-[50px]" />
          </div>

          {/* Application */}
          <div className="grid min-h-[590px] grid-cols-[220px_1fr_210px]">

            {/* ================= SIDEBAR ================= */}
            <aside className="border-r border-white/[0.06] bg-[#05070A]">

              {/* Brand */}
              <div className="flex h-[58px] items-center border-b border-white/[0.06] px-4">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600">
                    <span className="text-xs font-bold text-white">N</span>
                  </div>

                  <span className="text-[13px] font-semibold text-[#F8FAFC]">
                    NoteSpace AI
                  </span>
                </div>
              </div>

              <div className="p-3">

                {/* Search */}
                <div className="mb-4 flex items-center gap-2 rounded-lg border border-white/[0.06] bg-white/[0.025] px-3 py-2">
                  <Search size={13} className="text-slate-600" />

                  <span className="text-[11px] text-slate-600">
                    Search...
                  </span>

                  <span className="ml-auto text-[9px] text-slate-700">
                    ⌘K
                  </span>
                </div>

                {/* New workspace */}
                <div className="mb-6 flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-3 py-2.5 text-[11px] font-semibold text-white shadow-[0_0_20px_rgba(37,99,235,0.2)]">
                  <Plus size={14} />
                  New Workspace
                </div>

                {/* Workspace */}
                <p className="mb-2 px-2 text-[9px] font-semibold uppercase tracking-[0.12em] text-slate-600">
                  Workspace
                </p>

                <div className="space-y-1">
                  {[
                    {
                      name: "Introduction to C Programming",
                      sources: "2 sources",
                      active: true,
                    },
                    {
                      name: "MERN Stack Development",
                      sources: "1 source",
                      active: false,
                    },
                    {
                      name: "AI Agents",
                      sources: "4 sources",
                      active: false,
                    },
                  ].map((item) => (
                    <div
                      key={item.name}
                      className={`rounded-lg px-3 py-2.5 ${
                        item.active
                          ? "bg-white/[0.06]"
                          : "bg-transparent"
                      }`}
                    >
                      <div className="flex items-center gap-2">

                        <FileText
                          size={14}
                          className={
                            item.active
                              ? "text-blue-400"
                              : "text-slate-600"
                          }
                        />

                        <span
                          className={`truncate text-[11px] ${
                            item.active
                              ? "font-medium text-slate-200"
                              : "text-slate-500"
                          }`}
                        >
                          {item.name}
                        </span>
                      </div>

                      <p className="ml-6 mt-1 text-[9px] text-slate-700">
                        {item.sources}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* User */}
              <div className="mt-auto border-t border-white/[0.06] p-3">
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-full bg-gradient-to-br from-blue-500 to-slate-700" />

                  <div className="min-w-0">
                    <p className="truncate text-[10px] font-medium text-slate-300">
                      Suman Preet Singh
                    </p>

                    <p className="truncate text-[9px] text-slate-700">
                      Personal workspace
                    </p>
                  </div>
                </div>
              </div>
            </aside>

            {/* ================= MAIN ================= */}
            <main className="flex min-w-0 flex-col bg-[#030405]">

              {/* Top bar */}
              <div className="flex h-[58px] items-center justify-between border-b border-white/[0.06] px-5">

                <div className="flex min-w-0 items-center gap-2">
                  <FileText
                    size={15}
                    className="shrink-0 text-blue-400"
                  />

                  <span className="truncate text-[12px] font-semibold text-slate-200">
                    Introduction to C Programming
                  </span>

                  <ChevronDown
                    size={13}
                    className="text-slate-600"
                  />
                </div>

                <div className="flex items-center gap-3">

                  <div className="hidden items-center gap-2 rounded-md border border-white/[0.06] bg-white/[0.02] px-3 py-1.5 sm:flex">
                    <Search
                      size={12}
                      className="text-slate-600"
                    />

                    <span className="text-[10px] text-slate-600">
                      Search in notebook...
                    </span>
                  </div>

                  <Bell
                    size={14}
                    className="text-slate-600"
                  />

                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/[0.08] text-[8px] font-semibold text-slate-300">
                    AK
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="border-b border-white/[0.05] px-5 py-3">

                <div className="inline-flex items-center gap-1 rounded-xl border border-white/[0.06] bg-white/[0.02] p-1">

                  <div className="flex items-center gap-1.5 rounded-lg bg-white/[0.07] px-3 py-1.5 text-[10px] font-medium text-white">
                    <Bot size={12} />
                    Chat
                  </div>

                  <div className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] text-slate-600">
                    <FileText size={12} />
                    Sources
                  </div>

                  <div className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] text-slate-600">
                    <Mic size={12} />
                    Podcast
                  </div>
                </div>
              </div>

              {/* Chat */}
              <div className="flex flex-1 flex-col px-7 py-7">

                {/* User message */}
                <div className="flex justify-end">
                  <div className="max-w-[65%] rounded-xl rounded-br-sm border border-blue-600/30 bg-blue-600/[0.12] px-4 py-2.5 text-[11px] text-slate-300">
                    Explain pointers in C with a simple example.
                  </div>
                </div>

                {/* AI response */}
                <div className="mt-7 flex gap-3">

                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-blue-600/10 ring-1 ring-blue-600/20">
                    <Bot
                      size={13}
                      className="text-blue-400"
                    />
                  </div>

                  <div className="max-w-[620px]">

                    <p className="text-[11px] leading-[1.8] text-slate-400">
                      A pointer is a variable that stores the memory address
                      of another variable. It allows C programs to directly
                      access and manipulate memory.
                    </p>

                    <div className="mt-4 rounded-lg border border-white/[0.06] bg-white/[0.025] p-3">
                      <div className="mb-2 flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />

                        <span className="text-[9px] font-medium text-slate-500">
                          Example
                        </span>
                      </div>

                      <div className="font-mono text-[10px] leading-5 text-slate-500">
                        <span className="text-blue-400">int</span>{" "}
                        value = 10;
                        <br />
                        <span className="text-blue-400">int</span> *ptr =
                        &amp;value;
                        <br />
                        printf("%d", *ptr);
                      </div>
                    </div>

                    {/* Citations */}
                    <div className="mt-4 flex flex-wrap gap-1.5">

                      {[
                        "C Fundamentals.pdf",
                        "Pointers.pdf",
                      ].map((source) => (
                        <span
                          key={source}
                          className="flex items-center gap-1 rounded-md border border-blue-600/20 bg-blue-600/[0.07] px-2 py-1 text-[9px] text-blue-400"
                        >
                          <Quote size={9} />
                          {source}
                        </span>
                      ))}

                    </div>
                  </div>
                </div>

                {/* Input */}
                <div className="mt-auto pt-8">

                  <div className="rounded-xl border border-blue-600/30 bg-[#05070A] px-4 py-3 shadow-[0_0_30px_rgba(37,99,235,0.06)]">

                    <div className="text-[10px] text-slate-700">
                      Ask anything about your sources...
                    </div>

                    <div className="mt-3 flex items-center justify-between">

                      <div className="flex items-center gap-3 text-slate-700">
                        <span className="text-sm">⌕</span>
                        <span className="text-sm">@</span>

                        <span className="text-[9px]">
                          Press Enter to send
                        </span>
                      </div>

                      <div className="flex h-6 w-6 items-center justify-center rounded-md bg-white/[0.06] text-slate-600">
                        ↑
                      </div>
                    </div>
                  </div>

                  <p className="mt-2 text-center text-[8px] text-slate-700">
                    NoteSpace AI can make mistakes. Verify important
                    information against your sources.
                  </p>
                </div>
              </div>
            </main>

            {/* ================= RIGHT PANEL ================= */}
            <aside className="border-l border-white/[0.06] bg-[#05070A]">

              {/* Panel tabs */}
              <div className="flex h-[58px] items-center border-b border-white/[0.06] px-3">

                <div className="flex w-full rounded-lg bg-white/[0.025] p-1">

                  <div className="flex flex-1 items-center justify-center gap-1 rounded-md bg-white/[0.06] py-1.5 text-[9px] font-medium text-slate-300">
                    <PanelRight size={10} />
                    Sources
                  </div>

                  <div className="flex flex-1 items-center justify-center gap-1 py-1.5 text-[9px] text-slate-600">
                    <Quote size={10} />
                    Citations
                  </div>
                </div>
              </div>

              {/* Sources */}
              <div className="p-3">

                {[
                  {
                    type: "PDF",
                    title: "C Fundamentals.pdf",
                    match: "94%",
                    icon: FileText,
                  },
                  {
                    type: "WEB",
                    title: "cplusplus.com",
                    match: "87%",
                    icon: Globe,
                  },
                  {
                    type: "TXT",
                    title: "Interview Notes",
                    match: "72%",
                    icon: FileText,
                  },
                ].map((source) => {
                  const Icon = source.icon;

                  return (
                    <div
                      key={source.title}
                      className="mb-2.5 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3"
                    >

                      <div className="flex items-center gap-2">

                        <div className="flex h-6 w-6 items-center justify-center rounded-md bg-blue-600/[0.08]">
                          <Icon
                            size={12}
                            className="text-blue-400"
                          />
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-[9px] font-medium text-slate-400">
                            {source.title}
                          </p>

                          <p className="mt-0.5 text-[8px] text-slate-700">
                            {source.type}
                          </p>
                        </div>
                      </div>

                      <div className="mt-3 h-1 rounded-full bg-white/[0.05]">
                        <div
                          className="h-full rounded-full bg-blue-500"
                          style={{ width: source.match }}
                        />
                      </div>

                      <p className="mt-1.5 text-right text-[8px] text-slate-700">
                        {source.match} match
                      </p>
                    </div>
                  );
                })}
              </div>
            </aside>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProductPreview;