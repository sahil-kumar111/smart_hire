interface Props {

    text: string;

}

export default function TranscriptCard({

    text,

}: Props) {

    const analyzing =
        text ===
        "Analyzing your answer...";

    return (

        <div className="bg-white rounded-xl shadow-md p-6 min-h-[180px]">

            <h2 className="font-bold text-xl">

                Transcript

            </h2>

            {

                analyzing ?

                    <div className="animate-pulse mt-6 space-y-5">

                        <div className="h-4 w-full bg-gray-300 rounded"></div>

                        <div className="h-4 w-5/6 bg-gray-300 rounded"></div>

                        <div className="h-4 w-3/4 bg-gray-300 rounded"></div>

                    </div>

                    :

                    <p className="mt-5 leading-8">

                        {text}

                    </p>

            }

        </div>

    );

}