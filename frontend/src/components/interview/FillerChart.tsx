import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
} from "recharts";
import { MessageSquare } from "lucide-react";

type Props = {
    data: any[];
};

export default function FillerChart({ data }: Props) {
    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-violet-50 flex items-center justify-center">
                        <MessageSquare size={16} className="text-violet-600" />
                    </div>
                    <div>
                        <h2 className="text-[15px] font-semibold text-gray-900">
                            Filler Words
                        </h2>
                        <p className="text-[12px] text-gray-500">
                            Filler words count over time
                        </p>
                    </div>
                </div>
                <span className="text-[12px] text-gray-500 bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-100">
                    Bar Chart
                </span>
            </div>

            <ResponsiveContainer width="100%" height={260}>
                <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                    <XAxis
                        dataKey="time"
                        tick={{ fontSize: 11, fill: "#9ca3af" }}
                        axisLine={false}
                        tickLine={false}
                    />
                    <YAxis
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
                        cursor={{ fill: "#f3f4f6" }}
                    />
                    <Bar
                        dataKey="fillers"
                        fill="#8b5cf6"
                        radius={[6, 6, 0, 0]}
                        maxBarSize={48}
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}