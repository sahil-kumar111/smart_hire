type QuestionPanelProps = {

    question: string;

    currentQuestion: number;

    totalQuestions: number;

};

export default function QuestionPanel({

    question,

    currentQuestion,

    totalQuestions,

}: QuestionPanelProps) {

    return (

        <div className="bg-white rounded-xl shadow p-6">

            <h2 className="text-xl font-semibold mb-4">

                Question

            </h2>

            <p className="text-gray-500 mb-4">

                Question {currentQuestion + 1} / {totalQuestions}

            </p>

            <div className="rounded-lg bg-blue-50 border border-blue-200 p-4">

                <p className="text-lg font-medium">

                    {question}

                </p>

            </div>

        </div>

    );

}