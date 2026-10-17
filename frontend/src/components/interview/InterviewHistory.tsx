import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

type HistoryItem = {
    session_id: number;
    overall_score: number;
    date: string;
};

export default function InterviewHistory() {

    const navigate = useNavigate();

    const token = localStorage.getItem("token");

    const [history, setHistory] = useState<HistoryItem[]>([]);

    const [loading, setLoading] = useState(true);

    useEffect(() => {

        loadHistory();

    }, []);

    async function loadHistory() {

        try {

            const response = await axios.get(

                "http://127.0.0.1:8000/api/v1/interview-monitor/history",

                {

                    headers: {

                        Authorization: `Bearer ${token}`,

                    },

                }

            );

            setHistory(response.data);

        }

        catch (error) {

            console.error(error);

        }

        finally {

            setLoading(false);

        }

    }

    if (loading) {

        return (

            <div className="p-10 text-center">

                Loading Interview History...

            </div>

        );

    }

    return (

        <div className="min-h-screen bg-gray-100 p-8">

            <h1 className="text-4xl font-bold mb-8">

                Interview History

            </h1>

            <div className="bg-white rounded-xl shadow overflow-hidden">

                <table className="w-full">

                    <thead className="bg-gray-200">

                        <tr>

                            <th className="p-4 text-left">

                                Session

                            </th>

                            <th className="p-4 text-left">

                                Date

                            </th>

                            <th className="p-4 text-left">

                                Score

                            </th>

                            <th className="p-4 text-center">

                                Action

                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {

                            history.map((item) => (

                                <tr
                                    key={item.session_id}
                                    className="border-b"
                                >

                                    <td className="p-4">

                                        #{item.session_id}

                                    </td>

                                    <td className="p-4">

                                        {new Date(item.date).toLocaleString()}

                                    </td>

                                    <td className="p-4 font-semibold">

                                        {item.overall_score.toFixed(1)}

                                    </td>

                                    <td className="p-4 text-center">

                                        <button

                                            className="bg-blue-600 text-white px-4 py-2 rounded"

                                            onClick={() =>

                                                navigate(

                                                    `/interview-analytics/${item.session_id}`

                                                )

                                            }

                                        >

                                            View Analytics

                                        </button>

                                    </td>

                                </tr>

                            ))

                        }

                    </tbody>

                </table>

            </div>

        </div>

    );

}