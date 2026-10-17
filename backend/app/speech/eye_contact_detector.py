from pathlib import Path

import cv2
import mediapipe as mp


class EyeContactDetector:

    def __init__(self):

        model_path = str(
            Path("models") / "face_landmarker.task"
        )

        base_options = (
            mp.tasks.BaseOptions(
                model_asset_path=model_path
            )
        )

        options = (
            mp.tasks.vision.FaceLandmarkerOptions(
                base_options=base_options,
                output_face_blendshapes=False,
                output_facial_transformation_matrixes=False,
                num_faces=1,
            )
        )

        self.detector = (
            mp.tasks.vision.FaceLandmarker.create_from_options(
                options
            )
        )

    def detect(
        self,
        image_path: str,
    ):

        image = mp.Image.create_from_file(
            image_path
        )

        result = self.detector.detect(
            image
        )

        if len(result.face_landmarks) == 0:

            return {

                "eye_contact": False,

                "confidence": 0,

            }

        landmarks = (
            result.face_landmarks[0]
        )

        left_iris = landmarks[468]
        right_iris = landmarks[473]

        left_eye = landmarks[33]
        right_eye = landmarks[263]

        left_offset = abs(
            left_iris.x - left_eye.x
        )

        right_offset = abs(
            right_iris.x - right_eye.x
        )

        avg_offset = (
            left_offset + right_offset
        ) / 2

        eye_contact = (
            avg_offset < 0.07
        )

        confidence = round(
            max(
                0,
                (1 - avg_offset) * 100,
            ),
            2,
        )

        return {

            "eye_contact": eye_contact,

            "confidence": confidence,

        }