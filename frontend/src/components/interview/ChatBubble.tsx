interface ChatBubbleProps {

    role: "assistant" | "user";

    message: string;

}

export default function ChatBubble({

    role,

    message,

}: ChatBubbleProps) {

    const isAssistant = role === "assistant";

    return (

        <div
            className={`flex ${
                isAssistant
                    ? "justify-start"
                    : "justify-end"
            }`}
        >

            <div
                className={`max-w-[75%] rounded-2xl px-4 py-3 shadow-md whitespace-pre-wrap
                ${
                    isAssistant
                        ? "bg-white text-gray-800"
                        : "bg-blue-600 text-white"
                }`}
            >

                <div className="text-xs font-semibold mb-1">

                    {isAssistant
                        ? "AI Interviewer"
                        : "You"}

                </div>

                <div>

                    {message}

                </div>

            </div>

        </div>

    );

}