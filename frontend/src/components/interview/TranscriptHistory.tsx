import { MessageSquare, FileText } from "lucide-react";

type Props = {
    transcripts: string[];
};

export default function TranscriptHistory({ transcripts }: Props) {
    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center gap-2 mb-5">
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                    <MessageSquare size={16} className="text-blue-600" />
                </div>
                <div>
                    <h2 className="text-[15px] font-semibold text-gray-900">
                        Transcript History
                    </h2>
                    <p className="text-[12px] text-gray-500">
                        Complete interview conversation transcript
                    </p>
                </div>
            </div>

            <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
                {transcripts.map((text, index) => (
                    <div
                        key={index}
                        className="flex rounded-xl border border-gray-100 overflow-hidden bg-white hover:shadow-sm transition"
                    >
                        {/* Left column */}
                        <div className="w-36 shrink-0 bg-blue-50/70 px-4 py-4 flex flex-col justify-center border-r border-gray-100">
                            <div className="flex items-center gap-2 mb-1">
                                <FileText size={14} className="text-blue-600" />
                                <span className="text-[13px] font-semibold text-gray-800">
                                    Recording {index + 1}
                                </span>
                            </div>
                            <span className="text-[11px] text-gray-500 pl-5">
                                {new Date().toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })}
                            </span>
                        </div>

                        {/* Transcript text */}
                        <div className="flex-1 px-4 py-3.5">
                            <p className="text-[13px] text-gray-700 leading-relaxed">
                                {text || "No transcript available."}
                            </p>
                        </div>
                    </div>
                ))}

                {transcripts.length === 0 && (
                    <div className="text-center py-10 text-gray-400 text-sm">
                        No transcripts recorded yet.
                    </div>
                )}
            </div>
        </div>
    );
}