interface Props {

    total: number;

    fluency: number;

}

export default function FillerWordCard({

    total,

    fluency,

}: Props) {

    const analyzing =
        fluency === -1;

    return (

        <div className="bg-white rounded-xl shadow-md p-6 min-h-[170px]">

            <h2 className="font-bold text-xl">

                Communication

            </h2>

            {

                analyzing ?

                    <div className="animate-pulse mt-6 space-y-5">

                        <div className="h-4 w-full rounded bg-gray-300"></div>

                        <div className="h-4 w-2/3 rounded bg-gray-300"></div>

                        <div className="h-4 w-5/6 rounded bg-gray-300"></div>

                    </div>

                    :

                    <div className="mt-5 space-y-2">

                        <p>

                            Filler Words: {total}

                        </p>

                        <p>

                            Fluency Score: {fluency.toFixed(1)}

                        </p>

                    </div>

            }

        </div>

    );

}