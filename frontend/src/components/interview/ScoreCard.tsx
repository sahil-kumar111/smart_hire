interface Props {

    score: number;

    recommendation: string;

}

export default function ScoreCard({

    score,

    recommendation,

}: Props) {

    const analyzing =
        recommendation ===
        "Generating AI feedback...";

    return (

        <div className="bg-white rounded-xl shadow-md p-6 min-h-[185px] flex flex-col">

            <h2 className="text-xl font-bold">

                Overall AI Score

            </h2>

            <div className="flex-1 flex items-center justify-center mt-2">

                {

                    analyzing ?

                        <div className="animate-pulse">

                            <div className="h-16 w-28 rounded-xl skeleton"></div>

                        </div>

                        :

                        <div className="text-6xl font-bold text-blue-600">

                            {score.toFixed(1)}

                        </div>

                }

            </div>

            {

                !analyzing &&

                <div className="text-center text-lg mt-3">

                    {recommendation}

                </div>

            }

        </div>

    );

}