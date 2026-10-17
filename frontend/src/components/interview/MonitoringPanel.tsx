import ScoreCard from "./ScoreCard";
import EmotionCard from "./EmotionCard";
import EyeContactCard from "./EyeContactCard";
import TranscriptCard from "./TranscriptCard";
import FillerWordCard from "./FillerWordCard";
import RecommendationCard from "./RecommendationCard";

type MonitoringPanelProps = {

    transcript: string;

    emotion: string;

    eyeContact: string;

    fillerWords: number;

    fluency: number;

    overallScore: number;

    recommendation: string;

};

export default function MonitoringPanel({

    transcript,

    emotion,

    eyeContact,

    fillerWords,

    fluency,

    overallScore,

    recommendation,

}: MonitoringPanelProps) {

    return (

        <div className="space-y-6">

            {/* Top Cards */}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

                <ScoreCard

                    score={overallScore}

                    recommendation={recommendation}

                />

                <EmotionCard

                    emotion={emotion}

                />

                <EyeContactCard
                    eyeContact={eyeContact === "Detected"}
                    confidence={eyeContact === "Analyzing..." ? -1 : 100}
                />

            </div>

            {/* Transcript */}

            <TranscriptCard

                text={transcript}

            />

            {/* Bottom Cards */}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                <FillerWordCard

                    total={fillerWords}

                    fluency={fluency}

                />

                <RecommendationCard

                    recommendation={recommendation}

                />

            </div>

        </div>

    );

}