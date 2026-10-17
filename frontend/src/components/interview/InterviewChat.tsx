import { useState } from "react";

interface Props {
    messages: any[];
    onSend: (message: string) => void;
    loading: boolean;
}

export default function InterviewChat({
    messages,
    onSend,
    loading,
}: Props) {

    const [text, setText] = useState("");

    const send = () => {

        if (!text.trim()) return;

        onSend(text);

        setText("");

    };

    return (

        <div className="bg-white rounded-xl shadow p-6">

            <h2 className="text-xl font-bold mb-4">
                Live AI Interview
            </h2>

            <div className="border rounded-lg h-[450px] overflow-y-auto p-4 space-y-4 bg-gray-50">

                {messages.map((msg, index) => (

                    <div
                        key={index}
                        className={
                            msg.role === "candidate"
                                ? "text-right"
                                : "text-left"
                        }
                    >

                        <div
                            className={
                                msg.role === "candidate"
                                    ? "inline-block bg-blue-600 text-white rounded-lg px-4 py-2"
                                    : "inline-block bg-gray-200 rounded-lg px-4 py-2"
                            }
                        >

                            {msg.message}

                        </div>

                    </div>

                ))}

                {loading && (

                    <p className="text-gray-500">
                        AI is typing...
                    </p>

                )}

            </div>

            <div className="flex gap-3 mt-5">

                <input
                    className="flex-1 border rounded-lg px-4 py-2"
                    placeholder="Type your answer..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={(e) => {

                        if (e.key === "Enter") {

                            send();

                        }

                    }}
                />

                <button
                    onClick={send}
                    className="bg-blue-600 text-white px-5 rounded-lg"
                >

                    Send

                </button>

            </div>

        </div>

    );

}