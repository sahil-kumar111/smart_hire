from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
)


class PDFReportService:

    def generate(
        self,
        report: dict,
    ):

        output_dir = Path("reports")

        output_dir.mkdir(
            exist_ok=True
        )

        filename = (
            output_dir
            / f"interview_{report['session_id']}.pdf"
        )

        document = SimpleDocTemplate(
            str(filename)
        )

        styles = getSampleStyleSheet()

        elements = []

        elements.append(

            Paragraph(

                "SmartHire AI Interview Report",

                styles["Title"],

            )

        )

        elements.append(
            Spacer(
                1,
                20,
            )
        )

        table = Table(

            [

                ["Session ID", report["session_id"]],

                ["Transcript", report["transcript"]],

                ["Word Count", report["word_count"]],

                ["Duration", report["duration"]],

                ["Fluency", report["fluency_score"]],

                ["Filler Words", report["filler_count"]],

                ["Emotion", report["dominant_emotion"]],

                ["Eye Contact", report["eye_contact_score"]],

                ["Overall Score", report["overall_score"]],

                ["Recommendation", report["recommendation"]],

            ]

        )

        table.setStyle(

            TableStyle(

                [

                    ("GRID", (0, 0), (-1, -1), 1, colors.black),

                    ("BACKGROUND", (0, 0), (0, -1), colors.lightblue),

                    ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),

                    ("BOTTOMPADDING", (0, 0), (-1, -1), 10),

                ]

            )

        )

        elements.append(table)

        document.build(elements)

        return str(filename)