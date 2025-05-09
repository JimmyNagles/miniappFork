import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/app/store";

import { claimedAwardModel, startModel } from "@/features/challenges/model";

import { Challenge } from "@/entities/challenges/model/types";
import { challengesInfoModel } from "@/entities/challenges";

import { ChallengeStatus, ChallengeType } from "@/shared/api/enums";
import { useGlobalTrigger, useToaster } from "@/shared/providers";

import { ChallengeModalBase } from "./ChallengeModalBase";

export type ActiveChallengeModalProps = {
  isOpen: boolean;
  challenge: Challenge;
  setIsOpen: (isOpen: boolean) => void;
};

export const ActiveChallengeModal: React.FC<ActiveChallengeModalProps> = ({
  isOpen,
  setIsOpen,
  challenge,
}) => {
  const {
    challengeInfo,
    isPending,
    isClaimPending,
    isStartPending,
    startState,
    claimAwardState,
  } = useSelector((state: RootState) => ({
    isPending: state.challengesInfo.isPending,
    challengeInfo: state.challengesInfo.challenge,
    isStartPending: state.startChallenge.state === "pending",
    isClaimPending: state.claimChallengeAward.isPending,
    startState: state.startChallenge.state,
    claimAwardState: state.claimChallengeAward.state,
  }));
  const dispatch = useDispatch<AppDispatch>();

  const { trigger } = useGlobalTrigger();
  const { toast } = useToaster();

  const [isNotClaimed, setIsNotClaimed] = useState(false);
  const [isImitationEnded, setIsImitationEnded] = useState(false);

  // TODO: integrate openLink (e.g., native mobile redirect or wallet-aware handler)
  const openLink = (url: string) => {
    console.log("[openLink placeholder]", url);
    window.open(url, "_blank");
  };

  // TODO: support openTelegramLink alternative if needed
  const openTelegramLink = (url: string) => {
    console.log("[openTelegramLink placeholder]", url);
    window.open(url, "_blank");
  };

  const challengeData = useMemo(() => {
    function getStatus(status: ChallengeStatus) {
      if (status === ChallengeStatus.IN_PROGRESS && isImitationEnded) {
        return ChallengeStatus.NOT_CLAIMED;
      }
      return status;
    }

    if (!isPending && challengeInfo) {
      return {
        status: getStatus(challengeInfo.status),
        title: challengeInfo.title,
        award: challengeInfo.award,
        moderationTime: challengeInfo.moderationTime,
        buttonText:
          [ChallengeStatus.NOT_CLAIMED, ChallengeStatus.IN_PROGRESS].includes(
            challengeInfo.status
          ) && !isNotClaimed
            ? "Claim prize"
            : challengeInfo.actionText,
      };
    } else {
      return {
        status: getStatus(challenge.status),
        title: challenge.title,
        award: challenge.award,
        moderationTime: challenge.moderationTime,
        buttonText:
          [ChallengeStatus.NOT_CLAIMED, ChallengeStatus.IN_PROGRESS].includes(
            challenge.status
          ) && !isNotClaimed
            ? "Claim prize"
            : challenge.actionText,
      };
    }
  }, [isPending, challengeInfo, isNotClaimed, isImitationEnded]);

  const onClick = useCallback(async () => {
    if (challengeData.status === ChallengeStatus.NOT_STARTED) {
      dispatch(startModel.thunks.start(challenge));
    }
    if (challengeData.status === ChallengeStatus.NOT_CLAIMED && !isNotClaimed) {
      dispatch(claimedAwardModel.thunks.claimAward(challenge));
    }
    if (challengeData.status === ChallengeStatus.CLAIMED || isNotClaimed) {
      if (challenge.type === ChallengeType.IMITATION && challenge.link) {
        openLink(challenge.link);
      } else if (challenge.type === ChallengeType.REAL && challenge.channel) {
        openTelegramLink(
          `https://t.me/${challenge.channel.uri.replace("@", "")}`
        );
      }
      setIsOpen(false);
      setIsNotClaimed(false);
    }
  }, [challengeData, challenge, isNotClaimed]);

  useEffect(() => {
    if (isOpen) {
      dispatch(challengesInfoModel.thunks.fetch(challenge));
    }
  }, [isOpen]);

  useEffect(() => {
    if (startState === "success") {
      setTimeout(() => {
        setIsOpen(false);
        console.log("go via link");
        if (challenge.type === ChallengeType.IMITATION && challenge.link) {
          openLink(challenge.link);
        } else if (challenge.type === ChallengeType.REAL && challenge.channel) {
          openTelegramLink(
            `https://t.me/${challenge.channel.uri.replace("@", "")}`
          );
        }
        dispatch(startModel.actions.reset());
      }, 100);
    } else if (startState === "error") {
      trigger();
      dispatch(startModel.actions.reset());
    }
  }, [startState]);

  useEffect(() => {
    if (claimAwardState === "success") {
      setIsOpen(false);
      toast({
        type: "success",
        text: "Challenge completed!",
      });
      dispatch(claimedAwardModel.actions.reset());
    } else if (claimAwardState === "error") {
      toast({
        type: "error",
        text: "You haven't completed the task yet.",
      });
      dispatch(claimedAwardModel.actions.reset());
    } else if (claimAwardState === "not claimed") {
      toast({
        type: "error",
        text: "You haven't completed the task yet.",
      });
      setIsNotClaimed(true);
      dispatch(claimedAwardModel.actions.reset());
    }
  }, [claimAwardState]);

  return (
    <ChallengeModalBase
      {...challengeData}
      isOpen={isOpen}
      isLoading={isPending}
      isButtonLoading={isStartPending || isClaimPending}
      setIsOpen={setIsOpen}
      onClick={onClick}
      onTimerEnd={() => setIsImitationEnded(true)}
    />
  );
};
