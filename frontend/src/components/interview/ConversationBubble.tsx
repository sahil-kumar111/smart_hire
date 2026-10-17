interface Props {
    role: "assistant" | "candidate";
    message: string;
}

export default function ConversationBubble({
    role,
    message,
}: Props) {

    const isAI = role === "assistant";

    return (

        <div
            className={`flex mb-4 ${
                isAI
                    ? "justify-start"
                    : "justify-end"
            }`}
        >

            <div
                className={`max-w-[75%] rounded-2xl px-5 py-3 shadow-md whitespace-pre-wrap ${
                    isAI
                        ? "bg-white text-gray-800"
                        : "bg-blue-600 text-white"
                }`}
            >

                <div className="font-semibold mb-2">

                    {isAI
                        ? "SmartHire AI"
                        : "You"}

                </div>

                <div>

                    {message}

                </div>

            </div>

        </div>

    );

}