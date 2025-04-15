import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Webcam from "react-webcam";

import styles from "./Camera.module.scss";
import { ButtonIcon } from "@/shared/ui/ButtonIcon";

export type CameraProps = {
  onTakeVideo: (v: Blob) => void;
  onUserMediaError: () => void;
  onBack: () => void;
};

export const Camera: React.FC<CameraProps> = ({
  onTakeVideo,
  onUserMediaError,
  onBack,
}) => {
  const webcamRef = useRef<Webcam | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [facingMode, setFacingMode] = useState<"environment" | "user">(
    "environment"
  );

  const onClick = (isStart: boolean) => {
    if (webcamRef.current && webcamRef.current.stream) {
      setIsRecording(isStart);
      if (isStart) {
        mediaRecorderRef.current = new MediaRecorder(webcamRef.current.stream, {
          mimeType: "video/mp4",
        });
        mediaRecorderRef.current.addEventListener(
          "dataavailable",
          handleDataAvailable
        );
        mediaRecorderRef.current.start();
      } else {
        mediaRecorderRef.current?.stop();
      }
    }
  };

  const handleDataAvailable = ({ data }: BlobEvent) => {
    if (data.size > 0) {
      const blob = new Blob([data], { type: "video/mp4" });
      onTakeVideo(blob);
    }
  };

  useEffect(() => {
    // Placeholder for back button setup
    console.log("[BackButton placeholder] Attached to video camera screen");
    const cleanup = () => {
      console.log("[BackButton placeholder] Cleaned up");
    };

    return cleanup;
  }, []);

  return createPortal(
    <div
      className={[styles.root, isLoading ? styles["is-loading"] : ""]
        .join(" ")
        .trim()}
    >
      <Webcam
        ref={webcamRef}
        className={styles.webcam}
        height={window.innerHeight}
        mirrored={facingMode === "user"}
        videoConstraints={{
          facingMode,
          height: window.innerHeight,
        }}
        screenshotQuality={1}
        onUserMedia={() => {
          setIsLoading(false);
        }}
        onUserMediaError={onUserMediaError}
      />
      <button
        className={[styles.button, isRecording ? styles["is-recording"] : ""]
          .join(" ")
          .trim()}
        onClick={() => onClick(!isRecording)}
      />
      <ButtonIcon
        className={styles["button-toggle"]}
        size={"l"}
        view={"flat"}
        icon={"repeat"}
        onClick={() => {
          setFacingMode((prev) => (prev === "user" ? "environment" : "user"));
        }}
      />
    </div>,
    document.body
  );
};
