interface Props {

    eyeContact: boolean;

    confidence: number;

}

export default function EyeContactCard({

    eyeContact,

    confidence,

}: Props) {

    const analyzing =
        confidence === -1;

    return (

        <div className="bg-white rounded-xl shadow-md p-6 min-h-[185px]">

            <h2 className="font-bold text-xl">

                Eye Contact

            </h2>

            {

                analyzing ?

                    <div className="animate-pulse mt-10">

                        <div className="h-5 w-full rounded bg-gray-300 mb-5"></div>

                        <div className="h-4 rounded-full bg-gray-300"></div>

                    </div>

                    :

                    <>

                        <div className="mt-6">

                            {

                                eyeContact

                                    ?

                                    "Looking at Camera"

                                    :

                                    "Looking Away"

                            }

                        </div>

                        <div className="mt-5">

                            Confidence

                        </div>

                        <div className="mt-2 w-full bg-gray-200 rounded-full h-4">

                            <div

                                className="bg-green-500 h-4 rounded-full"

                                style={{

                                    width: `${confidence}%`

                                }}

                            />

                        </div>

                    </>

            }

        </div>

    );

}