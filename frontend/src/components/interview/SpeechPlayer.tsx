import { useEffect } from "react";

interface Props {

    text: string;

}

export default function SpeechPlayer({

    text,

}: Props) {

    useEffect(() => {

        if (!text.trim()) {

            return;

        }

        const synth =
            window.speechSynthesis;

        synth.cancel();

        const utterance =
            new SpeechSynthesisUtterance(
                text,
            );

        utterance.rate = 1;

        utterance.pitch = 1;

        utterance.volume = 1;

        const voices =
            synth.getVoices();

        const englishVoice =
            voices.find(

                (voice) =>

                    voice.lang.startsWith("en") &&

                    (
                        voice.name.includes("Google") ||
                        voice.name.includes("Microsoft")
                    ),

            );

        if (englishVoice) {

            utterance.voice =
                englishVoice;

        }

        synth.speak(
            utterance,
        );

        return () => {

            synth.cancel();

        };

    }, [text]);

    return null;

}