import { Sparkles } from "lucide-react";

export default function ConversationStarters({
  suggestions = [],
  onPick,
}) {
  return (
    <div className="w-full max-w-xl">
      <div className="mb-6 flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-primary" />

        <span className="text-sm font-medium text-foreground">
          Suggested Questions
        </span>
      </div>

      <div className="grid gap-3">
        {suggestions.map((question) => (
          <button
            key={question.id}
            onClick={() => onPick(question.prompt)}
            className="
              rounded-xl
              border
              border-border
              bg-card
              px-4
              py-3
              text-left
              text-sm
              transition-all
              hover:border-primary/30
              hover:bg-muted
              hover:shadow-soft
            "
          >
            <div className="font-medium text-foreground">
              {question.title}
            </div>

            {question.description && (
              <div className="mt-1 text-xs leading-relaxed text-muted-foreground">
                {question.description}
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}