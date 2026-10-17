import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
} from "recharts";
import { TrendingUp } from "lucide-react";

type Props = {
    data: any[];
};

export default function ScoreChart({ data }: Props) {
    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                        <TrendingUp size={16} className="text-blue-600" />
                    </div>
                    <div>
                        <h2 className="text-[15px] font-semibold text-gray-900">
                            Overall Score Timeline
                        </h2>
                        <p className="text-[12px] text-gray-500">
                            Your performance trend throughout the interview
                        </p>
                    </div>
                </div>
                <span className="text-[12px] text-gray-500 bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-100">
                    Line Chart
                </span>
            </div>

            <ResponsiveContainer width="100%" height={260}>
                <LineChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis
                        dataKey="time"
                        tick={{ fontSize: 11, fill: "#9ca3af" }}
                        axisLine={false}
                        tickLine={false}
                    />
                    <YAxis
                        domain={[0, 100]}
                        tick={{ fontSize: 11, fill: "#9ca3af" }}
                        axisLine={false}
                        tickLine={false}
                    />
                    <Tooltip
                        contentStyle={{
                            borderRadius: "10px",
                            border: "1px solid #e5e7eb",
                            fontSize: "12px",
                        }}
                    />
                    <Line
                        type="monotone"
                        dataKey="score"
                        stroke="#3b82f6"
                        strokeWidth={2.5}
                        dot={{ r: 4, fill: "#3b82f6", strokeWidth: 0 }}
                        activeDot={{ r: 6 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}