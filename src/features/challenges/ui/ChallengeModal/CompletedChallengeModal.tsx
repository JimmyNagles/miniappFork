import React, { useCallback } from "react";

import { Challenge } from "@/entities/challenges/model/types";
import { ChallengeStatus, ChallengeType } from "@/shared/api/enums";

import { ChallengeModalBase } from "./ChallengeModalBase";

export type CompletedChallengeModalProps = {
  isOpen: boolean;
  challenge: Challenge;
  setIsOpen: (isOpen: boolean) => void;
};

export const CompletedChallengeModal: React.FC<
  CompletedChallengeModalProps
> = ({ isOpen, setIsOpen, challenge }) => {
  // TODO: replace openLink / openTelegramLink with proper navigation handler
  const openLink = (url: string) => {
    console.log("[openLink placeholder]", url);
    window.open(url, "_blank");
  };

  const openTelegramLink = (url: string) => {
    console.log("[openTelegramLink placeholder]", url);
    window.open(url, "_blank");
  };

  const onClick = useCallback(() => {
    if (challenge.type === ChallengeType.IMITATION && challenge.link) {
      openLink(challenge.link);
    } else if (challenge.type === ChallengeType.REAL && challenge.channel) {
      openTelegramLink(
        `https://t.me/${challenge.channel.uri.replace("@", "")}`
      );
    }
    setIsOpen(false);
  }, [challenge]);

  return (
    <ChallengeModalBase
      status={ChallengeStatus.CLAIMED}
      title={challenge.title}
      award={challenge.award}
      buttonText={challenge.actionText}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      onClick={onClick}
    />
  );
};
