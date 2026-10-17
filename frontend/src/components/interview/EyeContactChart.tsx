import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
} from "recharts";
import { Eye } from "lucide-react";

type Props = {
    data: any[];
};

export default function EyeContactChart({ data }: Props) {
    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                        <Eye size={16} className="text-emerald-600" />
                    </div>
                    <div>
                        <h2 className="text-[15px] font-semibold text-gray-900">
                            Eye Contact
                        </h2>
                        <p className="text-[12px] text-gray-500">
                            Eye contact percentage over time
                        </p>
                    </div>
                </div>
                <span className="text-[12px] text-gray-500 bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-100">
                    Area Chart
                </span>
            </div>

            <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <defs>
                        <linearGradient id="eyeGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#10b981" stopOpacity={0.3} />
                            <stop offset="100%" stopColor="#10b981" stopOpacity={0.05} />
                        </linearGradient>
                    </defs>
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
                    <Area
                        type="monotone"
                        dataKey="eye_contact"
                        stroke="#10b981"
                        strokeWidth={2}
                        fill="url(#eyeGradient)"
                        dot={{ r: 3, fill: "#10b981", strokeWidth: 0 }}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}