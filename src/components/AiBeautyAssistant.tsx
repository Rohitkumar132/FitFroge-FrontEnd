import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { MessageCircle, Send, Sparkles, X } from "lucide-react";

const quickPrompts = [
  "I have dry skin and dullness",
  "Build a beginner skincare routine",
  "I need party makeup under Rs. 2000",
];

const getReply = (message: string) => {
  const text = message.toLowerCase();

  if (text.includes("dry") || text.includes("dull")) {
    return "For dry or dull skin, start with a gentle cleanser, hydrating serum, barrier moisturizer, and SPF. Look for hyaluronic acid, ceramides, and glow primers.";
  }
  if (text.includes("acne") || text.includes("oily")) {
    return "For acne-prone or oily skin, try a gel cleanser, niacinamide serum, lightweight moisturizer, and non-comedogenic SPF. Add salicylic acid 2-3 times weekly.";
  }
  if (text.includes("party") || text.includes("makeup")) {
    return "For a party look, compare long-wear foundation, cream blush, shimmer eyeshadow, waterproof mascara, and a statement lip. Use Compare to pick by price and rating.";
  }
  return "Tell me your skin type, budget, and goal. I can suggest a cleanser, serum, moisturizer, makeup finish, or haircare routine from the Cosmiq catalog.";
};

const AiBeautyAssistant = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Hi, I am Cosmiq AI. Tell me your skin type, concern, budget, or beauty goal.",
    },
  ]);

  const canSend = input.trim().length > 0;
  const lastSuggestion = useMemo(() => messages[messages.length - 1]?.text || "", [messages]);

  const send = (value = input) => {
    const clean = value.trim();
    if (!clean) return;
    setMessages(prev => [...prev, { role: "user", text: clean }, { role: "assistant", text: getReply(clean) }]);
    setInput("");
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-24 right-4 z-[85] flex items-center gap-2 rounded-full bg-primary px-4 py-3 text-sm font-bold text-primary-foreground shadow-2xl transition-all hover:-translate-y-1 md:bottom-6"
      >
        <Sparkles size={18} /> Ask AI
      </button>

      {open && (
        <div className="fixed bottom-24 right-4 z-[100] flex max-h-[78vh] w-[calc(100vw-2rem)] max-w-sm flex-col overflow-hidden rounded-2xl border border-border bg-background shadow-2xl md:bottom-6">
          <div className="brand-gradient flex items-center justify-between p-4 text-primary-foreground">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-background/20">
                <MessageCircle size={20} />
              </span>
              <div>
                <p className="font-bold">Cosmiq AI</p>
                <p className="text-xs text-primary-foreground/75">Beauty routine assistant</p>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="rounded-full p-1 hover:bg-background/20">
              <X size={18} />
            </button>
          </div>

          <div className="flex-1 space-y-3 overflow-auto p-4">
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={`rounded-xl px-4 py-3 text-sm ${
                  message.role === "assistant"
                    ? "bg-secondary text-foreground"
                    : "ml-8 bg-primary text-primary-foreground"
                }`}
              >
                {message.text}
              </div>
            ))}
          </div>

          <div className="border-t border-border p-4">
            <div className="mb-3 flex flex-wrap gap-2">
              {quickPrompts.map(prompt => (
                <button
                  key={prompt}
                  onClick={() => send(prompt)}
                  className="rounded-full border border-border px-3 py-1.5 text-xs font-semibold text-foreground hover:border-primary hover:text-primary"
                >
                  {prompt}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                value={input}
                onChange={event => setInput(event.target.value)}
                onKeyDown={event => { if (event.key === "Enter") send(); }}
                placeholder='Ask "glass skin serum"'
                className="min-w-0 flex-1 rounded-full border border-border bg-card px-4 py-2 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
              />
              <button
                onClick={() => send()}
                disabled={!canSend}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground disabled:opacity-50"
              >
                <Send size={16} />
              </button>
            </div>
            {lastSuggestion && (
              <Link to="/recommendations" className="mt-3 block text-center text-xs font-bold text-primary hover:underline">
                Open full routine builder
              </Link>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default AiBeautyAssistant;
