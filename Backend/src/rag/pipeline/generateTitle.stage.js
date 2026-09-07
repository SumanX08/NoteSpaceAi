import Notebook from "../../models/notebook.model.js";
import openai from "../../config/openai.js";

export default async function generateTitleStage(context) {
  try {
    const notebookId = context.source?.notebookId;

    console.log(
      "📚 Notebook ID for title generation:",
      notebookId
    );

    if (!notebookId) {
      console.log(
        "❌ No notebookId found on source:",
        context.source?._id
      );

      return context;
    }

    const notebook = await Notebook.findById(notebookId);

    if (!notebook) {
      console.log(
        "❌ Notebook not found:",
        notebookId
      );

      return context;
    }

    console.log(
      "📚 Current workspace title:",
      notebook.title
    );

    // Only automatically rename untitled workspaces
    if (notebook.title !== "Untitled Workspace") {
      console.log(
        "⏭️ Workspace already has a custom title. Skipping."
      );

      return context;
    }

    const text = context.extracted?.text
      ?.replace(/\s+/g, " ")
      .trim()
      .slice(0, 12000);

    if (!text) {
      console.log(
        "❌ No extracted text available."
      );

      return context;
    }

    console.log(
      "🤖 Generating workspace title..."
    );

    const response =
      await openai.chat.completions.create({
        model: "gpt-4.1-mini",
        temperature: 0.3,
        max_tokens: 20,

        messages: [
          {
            role: "system",
            content: `
Generate a short, descriptive title for a knowledge workspace.

Rules:
- 2 to 6 words
- Capture the main topic of the source
- Natural and professional
- No quotes
- No punctuation at the end
- Do not use "Document", "Notes", or "Workspace"
- Return ONLY the title
            `.trim(),
          },
          {
            role: "user",
            content: text,
          },
        ],
      });

    const title =
      response.choices?.[0]?.message?.content
        ?.trim()
        .replace(/^["']|["']$/g, "")
        .replace(/[.!?:]+$/, "");

    if (!title) {
      console.log(
        "❌ OpenAI returned an empty title."
      );

      return context;
    }

    const updatedNotebook =
      await Notebook.findOneAndUpdate(
        {
          _id: notebookId,
          title: "Untitled Workspace",
        },
        {
          $set: {
            title,
          },
        },
        {
          new: true,
        }
      );

    if (!updatedNotebook) {
      console.log(
        "⚠️ Notebook was not updated."
      );

      return context;
    }

    console.log(
      `✅ Workspace renamed to: "${updatedNotebook.title}"`
    );

    return context;
  } catch (error) {
    console.error(
      "❌ Workspace title generation failed:",
      error
    );

    // Title generation should never
    // break source processing.
    return context;
  }
}