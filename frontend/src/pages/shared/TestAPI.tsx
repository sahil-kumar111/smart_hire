import { useEffect } from "react";
import api from "../../api/axios";

export default function TestAPI() {

    useEffect(() => {

        async function test() {

            try {

                const response = await api.get("/");

                console.log(response.data);

            }

            catch (error) {

                console.log(error);

            }

        }

        test();

    }, []);

    return (
        <div className="flex min-h-screen items-center justify-center">
            <h1 className="text-3xl font-bold">
                Testing Backend...
            </h1>
        </div>
    );
}