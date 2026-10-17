import { useState, useRef } from "react";
import { uploadResume } from "../../services/resumeService";
import { useAuth } from "../../contexts/AuthContext";
import toast from "react-hot-toast";
import { Upload, CloudUpload } from "lucide-react";

interface ResumeUploadProps {
    onUploadSuccess: () => void;
}

export default function ResumeUpload({ onUploadSuccess }: ResumeUploadProps) {
    const { token } = useAuth();
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    async function handleUpload() {
        if (!file || !token) {
            toast.error("Please select a PDF file.");
            return;
        }

        try {
            setLoading(true);
            await uploadResume(file, token);
            toast.success("Resume uploaded successfully!");
            setFile(null);
            if (inputRef.current) inputRef.current.value = "";
            onUploadSuccess();
        } catch (error) {
            console.error(error);
            toast.error("Upload failed.");
        } finally {
            setLoading(false);
        }
    }

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const selected = e.target.files?.[0];
        if (!selected) return;

        if (selected.type !== "application/pdf") {
            toast.error("Only PDF files are allowed.");
            return;
        }
        if (selected.size > 5 * 1024 * 1024) {
            toast.error("Maximum file size is 5 MB.");
            return;
        }
        setFile(selected);
    }

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 relative overflow-hidden">
            <div className="flex flex-col lg:flex-row lg:items-start gap-8">
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                            <CloudUpload size={20} className="text-blue-600" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900">
                                Upload Resume
                            </h2>
                            <p className="text-sm text-gray-500">
                                Upload your latest resume in PDF format.
                            </p>
                        </div>
                    </div>

                    <div className="mt-6 flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() => inputRef.current?.click()}
                            className="h-10 px-4 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition shrink-0"
                        >
                            Choose File
                        </button>

                        <div className="flex-1 h-10 rounded-xl border border-gray-200 bg-gray-50/50 px-4 flex items-center text-sm text-gray-500 truncate">
                            {file ? file.name : "No file chosen"}
                        </div>

                        <input
                            ref={inputRef}
                            type="file"
                            accept=".pdf"
                            className="hidden"
                            onChange={handleFileChange}
                        />
                    </div>

                    <p className="text-xs text-gray-400 mt-2">
                        Only PDF files are allowed.
                    </p>

                    <button
                        onClick={handleUpload}
                        disabled={loading || !file}
                        className="mt-5 flex items-center gap-2 h-11 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white text-sm font-medium transition shadow-sm"
                    >
                        <Upload size={16} />
                        {loading ? "Uploading..." : "Upload Resume"}
                    </button>
                </div>

                <div className="hidden lg:flex items-center justify-center shrink-0 w-56">
                    <div className="relative w-full h-40">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-50 rounded-2xl" />
                        <div className="absolute left-6 top-6 w-16 h-20 bg-white border border-blue-100 rounded-lg shadow-sm flex flex-col overflow-hidden">
                            <div className="h-3 bg-blue-50 border-b border-blue-100" />
                            <div className="flex-1 p-1.5 space-y-1">
                                <div className="h-1.5 bg-blue-100 rounded w-full" />
                                <div className="h-1.5 bg-blue-100 rounded w-4/5" />
                                <div className="h-1.5 bg-blue-100 rounded w-3/5" />
                            </div>
                        </div>
                        <div className="absolute left-14 top-3 bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow">
                            PDF
                        </div>
                        <div className="absolute right-4 bottom-4 w-24 h-16 bg-blue-100/90 rounded-full flex items-center justify-center shadow-inner">
                            <CloudUpload size={28} className="text-blue-500" />
                        </div>
                        <div className="absolute right-2 top-8 w-2 h-2 rounded-full bg-blue-200" />
                        <div className="absolute right-6 top-4 w-1.5 h-1.5 rounded-full bg-indigo-200" />
                    </div>
                </div>
            </div>
        </div>
    );
}