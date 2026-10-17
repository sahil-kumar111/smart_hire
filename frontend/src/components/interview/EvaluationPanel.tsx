type EvaluationPanelProps = {

    evaluation: any;

};

export default function EvaluationPanel({

    evaluation,

}: EvaluationPanelProps) {

    if (!evaluation) {

        return null;

    }

    return (

        <div className="bg-white rounded-xl shadow p-6">

            <h2 className="text-xl font-semibold mb-4">

                AI Evaluation

            </h2>

            <div className="space-y-5">

                <div className="flex justify-between">

                    <span>

                        Score

                    </span>

                    <span className="font-bold">

                        {evaluation.score}

                    </span>

                </div>

                <div>

                    <p className="font-semibold">

                        Feedback

                    </p>

                    <p className="text-gray-600">

                        {evaluation.feedback}

                    </p>

                </div>

                {

                    evaluation.strengths &&

                    <div>

                        <p className="font-semibold">

                            Strengths

                        </p>

                        <ul className="list-disc ml-5">

                            {

                                evaluation.strengths.map(

                                    (
                                        item: string,
                                        index: number
                                    ) => (

                                        <li key={index}>

                                            {item}

                                        </li>

                                    )

                                )

                            }

                        </ul>

                    </div>

                }

                {

                    evaluation.improvements &&

                    <div>

                        <p className="font-semibold">

                            Improvements

                        </p>

                        <ul className="list-disc ml-5">

                            {

                                evaluation.improvements.map(

                                    (
                                        item: string,
                                        index: number
                                    ) => (

                                        <li key={index}>

                                            {item}

                                        </li>

                                    )

                                )

                            }

                        </ul>

                    </div>

                }

            </div>

        </div>

    );

}