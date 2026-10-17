interface Props {

    recommendation: string;

}

export default function RecommendationCard({

    recommendation,

}: Props) {

    const analyzing =
        recommendation ===
        "Generating AI feedback...";

    return (

        <div className="bg-white rounded-xl shadow-md p-6 min-h-[185px]">

            <h2 className="font-bold text-xl">

                AI Recommendation

            </h2>

            <div className="mt-6">

                {

                    analyzing ?

                        <div className="animate-pulse">

                            <div className="h-8 w-full rounded bg-gray-300"></div>

                        </div>

                        :

                        <div className="text-2xl font-bold text-blue-600 leading-relaxed">

                            {recommendation}

                        </div>

                }

            </div>

        </div>

    );

}