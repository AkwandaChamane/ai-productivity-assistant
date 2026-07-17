import { useState } from "react";
import { downloadMarkdown, downloadPdf } from "@/lib/pdf";
import { saveDraft } from "@/lib/local-drafts";
import { useSession } from "@/lib/session-store";

export function OutputActions({
  tool,
  content,
  filenameBase,
}: {
  tool: string;
  content: string;
  filenameBase: string;
}) {
  const allowDrafts = useSession((s) => s.allowDrafts);
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  if (!content.trim()) return null;

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={async () => {
          await navigator.clipboard.writeText(content);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        }}
        className="rounded-md border border-input bg-background px-3 py-1.5 text-sm font-medium hover:bg-accent focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-baby-blue focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        {copied ? "Copied" : "Copy"}
      </button>
      <button
        onClick={() => downloadMarkdown(`${filenameBase}.md`, content)}
        className="rounded-md border border-input bg-background px-3 py-1.5 text-sm font-medium hover:bg-accent focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-baby-blue focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        Download MD
      </button>
      <button
        onClick={() => downloadPdf(`${filenameBase}.pdf`, content)}
        className="rounded-md border border-input bg-background px-3 py-1.5 text-sm font-medium hover:bg-accent focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-baby-blue focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        Download PDF
      </button>
      {allowDrafts && (
        <button
          onClick={() => {
            saveDraft(tool, content);
            setSaved(true);
            setTimeout(() => setSaved(false), 1500);
          }}
          className="rounded-md border border-dashed border-input bg-background px-3 py-1.5 text-sm font-medium hover:bg-accent focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-baby-blue focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          {saved ? "Saved locally" : "Save local draft"}
        </button>
      )}
    </div>
  );
}
