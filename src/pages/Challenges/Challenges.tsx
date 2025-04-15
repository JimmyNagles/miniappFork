import { useEffect, useState } from "react";

import {
  ActiveChallengesList,
  CompletedChallengesList,
} from "@/widgets/challenges";

import { images } from "@/shared/assets/images";
import { TabsCardLayout } from "@/shared/ui/TabsCardLayout";
import { useBackButton } from "@/shared/providers";

import styles from "./Challenges.module.scss";

export const Challenges = () => {
  // TODO: implement setHeaderColor with layout theming or other method
  const setHeaderColor = (color: string) => {
    console.log("[setHeaderColor placeholder]", color);
  };

  const { hide } = useBackButton();
  const [state, setState] = useState(0);

  useEffect(() => {
    setHeaderColor("#f7f7f8");
    hide();
  }, []);

  return (
    <div className={styles.root}>
      <img
        className={styles.image}
        src={images.Decorations.PageBgDecoration}
        alt="page decoration"
      />
      <h1 className={styles.title}>Challenges</h1>
      <TabsCardLayout
        state={state}
        setState={setState}
        tabs={["Active", "Completed"]}
        components={[<ActiveChallengesList />, <CompletedChallengesList />]}
      />
    </div>
  );
};
