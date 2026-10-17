type AnswerPanelProps = {

    answer: string;

    loading: boolean;

    onChange: (
        value: string
    ) => void;

    onSubmit: () => void;

    onFinish: () => void;

};

export default function AnswerPanel({

    answer,

    loading,

    onChange,

    onSubmit,

    onFinish,

}: AnswerPanelProps) {

    return (

        <div className="bg-white rounded-xl shadow p-6">

            <textarea

                rows={8}

                value={answer}

                onChange={(e) =>
                    onChange(e.target.value)
                }

                className="w-full rounded-xl border p-4"

                placeholder="Type your answer here..."

            />

            <div className="flex gap-4 mt-4">

                <button

                    onClick={onSubmit}

                    disabled={loading}

                    className={`px-5 py-2 rounded-lg text-white ${loading
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700"
                        }`}

                >

                    {

                        loading

                            ? "Evaluating..."

                            : "Submit Answer"

                    }

                </button>

                <button

                    onClick={onFinish}

                    disabled={loading}

                    className={`px-5 py-2 rounded-lg text-white ${loading
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-red-600 hover:bg-red-700"
                        }`}

                >

                    Finish Interview

                </button>

            </div>

        </div>

    );

}