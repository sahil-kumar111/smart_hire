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

        transcript_para = Paragraph(str(report.get("transcript", "N/A")), styles["Normal"])

        table = Table(
            [
                ["Session ID", str(report.get("session_id", ""))],
                ["Transcript", transcript_para],
                ["Word Count", str(report.get("word_count", 0))],
                ["Duration", f"{report.get('duration', 0):.1f}s"],
                ["Fluency Score", f"{report.get('fluency_score', 0):.1f}%"],
                ["Filler Words", str(report.get("filler_count", 0))],
                ["Dominant Emotion", str(report.get("dominant_emotion", "Neutral")).capitalize()],
                ["Eye Contact Score", f"{report.get('eye_contact_score', 0):.1f}%"],
                ["Overall Score", f"{report.get('overall_score', 0):.1f}/100"],
                ["Recommendation", str(report.get("recommendation", "Completed"))],
            ],
            colWidths=[130, 360],
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