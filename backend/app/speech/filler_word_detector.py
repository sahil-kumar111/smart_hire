from collections import Counter


class FillerWordDetector:

    def __init__(self):

        self.filler_words = [

            "um",

            "uh",

            "like",

            "actually",

            "basically",

            "you know",

            "kind of",

            "sort of",

        ]

    def analyze(
        self,
        text: str,
    ):

        lower = text.lower()

        counts = Counter()

        total_words = len(
            lower.split()
        )

        for word in self.filler_words:

            counts[word] = lower.count(word)

        total_fillers = sum(
            counts.values()
        )

        if total_words == 0:

            fluency_score = 100

        else:

            filler_percentage = (
                total_fillers
                / total_words
            ) * 100

            fluency_score = max(
                0,
                round(
                    100 - filler_percentage * 5,
                    2,
                ),
            )

        return {

            "total_words": total_words,

            "total_fillers": total_fillers,

            "fluency_score": fluency_score,

            "fillers": dict(counts),

        }