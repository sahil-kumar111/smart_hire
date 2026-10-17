interface Props {

    emotion: string;

}

export default function EmotionCard({

    emotion,

}: Props) {

    const analyzing =
        emotion ===
        "Analyzing...";

    return (

        <div className="bg-white rounded-xl shadow-md p-6 min-h-[185px]">

            <h2 className="font-bold text-xl">

                Emotion

            </h2>

            {

                analyzing ?

                    <div className="animate-pulse flex flex-col items-center justify-center h-[110px]">

                        <div className="h-14 w-14 rounded-full bg-gray-300"></div>

                        <div className="h-5 w-24 rounded bg-gray-300 mt-6"></div>

                    </div>

                    :

                    <div className="flex flex-col items-center justify-center h-[110px]">

                        <div className="text-6xl">

                            😊

                        </div>

                        <div className="mt-4 text-xl">

                            {emotion}

                        </div>

                    </div>

            }

        </div>

    );

}