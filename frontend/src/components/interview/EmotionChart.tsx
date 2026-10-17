import {
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
} from "recharts";
import { Smile } from "lucide-react";

type Props = {
    emotion: string;
};

const COLORS: Record<string, string> = {
    happy: "#22c55e",
    neutral: "#94a3b8",
    sad: "#64748b",
    angry: "#ef4444",
    surprised: "#f59e0b",
    fearful: "#8b5cf6",
    disgusted: "#f97316",
};

export default function EmotionChart({ emotion }: Props) {
    const data = [
        {
            name: emotion || "unknown",
            value: 100,
        },
    ];

    const color = COLORS[emotion?.toLowerCase()] || "#94a3b8";

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center">
                        <Smile size={16} className="text-rose-500" />
                    </div>
                    <div>
                        <h2 className="text-[15px] font-semibold text-gray-900">
                            Dominant Emotion
                        </h2>
                        <p className="text-[12px] text-gray-500">
                            Emotion distribution during the interview
                        </p>
                    </div>
                </div>
                <span className="text-[12px] text-gray-500 bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-100">
                    Pie Chart
                </span>
            </div>

            <div className="relative">
                <ResponsiveContainer width="100%" height={260}>
                    <PieChart>
                        <Pie
                            data={data}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            innerRadius={65}
                            outerRadius={95}
                            paddingAngle={0}
                            stroke="none"
                        >
                            <Cell fill={color} />
                        </Pie>
                        <Tooltip
                            contentStyle={{
                                borderRadius: "10px",
                                border: "1px solid #e5e7eb",
                                fontSize: "12px",
                            }}
                        />
                        <Legend
                            verticalAlign="bottom"
                            height={36}
                            formatter={(value) => (
                                <span className="text-sm text-gray-600 capitalize">
                                    {value}
                                </span>
                            )}
                        />
                    </PieChart>
                </ResponsiveContainer>

                {/* Center 100% text */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none pb-8">
                    <span className="text-2xl font-bold text-gray-700">100%</span>
                </div>
            </div>
        </div>
    );
}