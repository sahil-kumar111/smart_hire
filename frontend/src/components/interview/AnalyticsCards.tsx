import {
    Award,
    Eye,
    Mic,
    MessageSquare,
    Smile,
    Trophy,
} from "lucide-react";

type Props = {
    overallScore: number;
    recommendation: string;
    eyeContact: number;
    fluency: number;
    fillers: number;
    emotion: string;
};

function getLabel(value: number, type: "score" | "eye" | "fluency" | "fillers") {
    if (type === "fillers") {
        if (value <= 1) return { text: "Excellent", color: "bg-green-100 text-green-700" };
        if (value <= 1.5) return { text: "Good", color: "bg-blue-100 text-blue-700" };
        return { text: "Needs Improvement", color: "bg-orange-100 text-orange-700" };
    }
    if (value >= 85) return { text: "Excellent", color: "bg-green-100 text-green-700" };
    if (value >= 70) return { text: "Good", color: "bg-blue-100 text-blue-700" };
    return { text: "Needs Improvement", color: "bg-orange-100 text-orange-700" };
}

function getEmotionLabel(emotion: string) {
    const e = emotion?.toLowerCase() || "";
    if (["happy", "neutral", "surprised"].includes(e)) {
        return { text: "Good", color: "bg-green-100 text-green-700" };
    }
    return { text: "Needs Improvement", color: "bg-red-100 text-red-700" };
}

function getRecommendationLabel(rec: string) {
    const r = rec?.toLowerCase() || "";
    if (r.includes("outstanding") || r.includes("excellent")) {
        return { text: "Excellent", color: "bg-green-100 text-green-700" };
    }
    if (r.includes("good")) {
        return { text: "Good", color: "bg-blue-100 text-blue-700" };
    }
    return { text: "Needs Improvement", color: "bg-orange-100 text-orange-700" };
}

export default function AnalyticsCards({
    overallScore,
    recommendation,
    eyeContact,
    fluency,
    fillers,
    emotion,
}: Props) {
    const scoreLabel = getLabel(overallScore, "score");
    const eyeLabel = getLabel(eyeContact, "eye");
    const fluencyLabel = getLabel(fluency, "fluency");
    const fillersLabel = getLabel(fillers, "fillers");
    const emotionLabel = getEmotionLabel(emotion);
    const recLabel = getRecommendationLabel(recommendation);

    const cards = [
        {
            title: "Overall Score",
            value: `${overallScore.toFixed(1)}/100`,
            icon: <Award size={20} className="text-blue-600" />,
            iconBg: "bg-blue-50",
            barColor: "bg-blue-500",
            barWidth: Math.min(overallScore, 100),
            label: scoreLabel,
            valueColor: "text-blue-600",
        },
        {
            title: "Eye Contact",
            value: `${eyeContact.toFixed(1)}%`,
            icon: <Eye size={20} className="text-emerald-600" />,
            iconBg: "bg-emerald-50",
            barColor: "bg-emerald-500",
            barWidth: Math.min(eyeContact, 100),
            label: eyeLabel,
            valueColor: "text-emerald-600",
        },
        {
            title: "Fluency",
            value: `${fluency.toFixed(1)}/100`,
            icon: <Mic size={20} className="text-violet-600" />,
            iconBg: "bg-violet-50",
            barColor: "bg-violet-500",
            barWidth: Math.min(fluency, 100),
            label: fluencyLabel,
            valueColor: "text-violet-600",
        },
        {
            title: "Fillers (Avg/min)",
            value: fillers.toFixed(2),
            icon: <MessageSquare size={20} className="text-orange-500" />,
            iconBg: "bg-orange-50",
            barColor: "bg-orange-400",
            barWidth: Math.min(fillers * 25, 100),
            label: fillersLabel,
            valueColor: "text-orange-500",
        },
        {
            title: "Emotion",
            value: emotion || "--",
            icon: <Smile size={20} className="text-rose-500" />,
            iconBg: "bg-rose-50",
            barColor: "bg-rose-400",
            barWidth: 45,
            label: emotionLabel,
            valueColor: "text-rose-500",
        },
        {
            title: "Recommendation",
            value: recommendation || "--",
            icon: <Trophy size={20} className="text-amber-500" />,
            iconBg: "bg-amber-50",
            barColor: "bg-green-500",
            barWidth:
                recommendation?.toLowerCase().includes("excellent") ||
                recommendation?.toLowerCase().includes("outstanding")
                    ? 95
                    : 65,
            label: recLabel,
            valueColor:
                recommendation?.toLowerCase().includes("excellent") ||
                recommendation?.toLowerCase().includes("outstanding")
                    ? "text-green-600"
                    : "text-amber-600",
        },
    ];

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
            {cards.map((card) => (
                <div
                    key={card.title}
                    className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col"
                >
                    <div className="flex items-center gap-2.5 mb-3">
                        <div
                            className={`w-9 h-9 rounded-xl ${card.iconBg} flex items-center justify-center`}
                        >
                            {card.icon}
                        </div>
                        <p className="text-[13px] text-gray-500 font-medium">
                            {card.title}
                        </p>
                    </div>

                    <h2 className={`text-2xl font-bold ${card.valueColor} mb-3`}>
                        {card.value}
                    </h2>

                    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden mb-3">
                        <div
                            className={`h-full rounded-full ${card.barColor} transition-all`}
                            style={{ width: `${card.barWidth}%` }}
                        />
                    </div>

                    <span
                        className={`self-start text-[11px] font-medium px-2.5 py-0.5 rounded-full ${card.label.color}`}
                    >
                        {card.label.text}
                    </span>
                </div>
            ))}
        </div>
    );
}