import { useEffect, useRef } from "react";
import { Bot } from "lucide-react";

interface Message {
    id: number;
    role: "assistant" | "user";
    content: string;
}

interface ChatWindowProps {
    messages: Message[];
    loading: boolean;
}

export default function ChatWindow({ messages, loading }: ChatWindowProps) {
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, loading]);

    // Simple time formatter (you can replace with real timestamps if available)
    function getTime() {
        return new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        });
    }

    return (
        <div className="h-full overflow-y-auto bg-white px-2 py-2 space-y-5">
            {messages.map((message) => (
                <div
                    key={message.id}
                    className={`flex ${
                        message.role === "assistant"
                            ? "justify-start"
                            : "justify-end"
                    }`}
                >
                    {/* AI Avatar */}
                    {message.role === "assistant" && (
                        <div className="mr-3 mt-1 shrink-0">
                            <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center shadow-sm">
                                <Bot size={18} className="text-white" />
                            </div>
                        </div>
                    )}

                    <div
                        className={`max-w-[78%] ${
                            message.role === "assistant" ? "" : "text-right"
                        }`}
                    >
                        {/* Label + time */}
                        <div
                            className={`flex items-center gap-2 mb-1.5 text-[12px] ${
                                message.role === "assistant"
                                    ? "text-gray-500"
                                    : "justify-end text-blue-100"
                            }`}
                        >
                            <span className="font-semibold">
                                {message.role === "assistant"
                                    ? "AI Interviewer"
                                    : "You"}
                            </span>
                            <span className="opacity-70">• {getTime()}</span>
                        </div>

                        {/* Bubble */}
                        <div
                            className={`
                                rounded-2xl px-4 py-3 text-[14px] leading-relaxed
                                ${
                                    message.role === "assistant"
                                        ? "bg-gray-50 text-gray-800 border border-gray-100 shadow-sm"
                                        : "bg-blue-600 text-white shadow-sm"
                                }
                            `}
                        >
                            <div className="whitespace-pre-wrap">
                                {message.content}
                            </div>
                        </div>
                    </div>
                </div>
            ))}

            {/* Loading indicator */}
            {loading && (
                <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
                        <Bot size={18} className="text-white" />
                    </div>
                    <div>
                        <div className="text-[12px] text-gray-500 mb-1.5 font-semibold">
                            AI Interviewer
                        </div>
                        <div className="bg-gray-50 border border-gray-100 rounded-2xl px-5 py-3.5 shadow-sm">
                            <div className="flex gap-1.5">
                                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.15s]" />
                                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.3s]" />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div ref={bottomRef} />
        </div>
    );
}