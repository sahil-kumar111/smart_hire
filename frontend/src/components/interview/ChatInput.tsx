import { useState } from "react";
import { SendHorizonal } from "lucide-react";

interface ChatInputProps {
    onSend: (text: string) => void;
    disabled?: boolean;
}

export default function ChatInput({ onSend, disabled }: ChatInputProps) {
    const [text, setText] = useState("");

    function handleSend() {
        if (!text.trim()) return;
        onSend(text);
        setText("");
    }

    function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === "Enter") {
            e.preventDefault();
            handleSend();
        }
    }

    return (
        <div className="flex items-center gap-3">
            <input
                value={text}
                disabled={disabled}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your answer..."
                className="
                    flex-1
                    h-12
                    rounded-xl
                    border border-gray-200
                    bg-white
                    px-4
                    text-[14px] text-gray-700
                    outline-none
                    focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400
                    transition
                    placeholder:text-gray-400
                    disabled:bg-gray-50 disabled:cursor-not-allowed
                "
            />

            <button
                onClick={handleSend}
                disabled={disabled || !text.trim()}
                className="
                    h-12
                    px-5
                    rounded-xl
                    bg-blue-600
                    hover:bg-blue-700
                    text-white
                    font-medium text-sm
                    transition
                    flex items-center justify-center gap-2
                    shadow-sm
                    disabled:bg-gray-300 disabled:cursor-not-allowed
                "
            >
                <SendHorizonal size={16} />
                Send
            </button>
        </div>
    );
}