import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { AppDispatch, RootState } from "@/app/store";

import { expandTasksModel } from "@/entities/tasks";

import { images } from "@/shared/assets/images";
import { TransitionFade } from "@/shared/ui/TransitionFade";

import styles from "./TaskLayout.module.scss";

export type TaskLayoutProps = {
  Content: React.ReactNode;
  Skeleton: React.ReactNode;
};

export const TaskLayout: React.FC<TaskLayoutProps> = ({
  Content,
  Skeleton,
}) => {
  const params = useParams();

  const { pool, completionId, isPending } = useSelector(
    (state: RootState) => state.expandTasks
  );
  const dispatch = useDispatch<AppDispatch>();

  // TODO: replace with custom header color logic (e.g. theme, wallet, etc.)
  const setHeaderColor = (color: string) => {
    console.log("[setHeaderColor placeholder]", color);
  };

  useEffect(() => {
    setHeaderColor("#f7f7f8");
    dispatch(
      expandTasksModel.thunks.fetchExpandTask({
        id: Number(params.id),
        completionId: Number(completionId),
        pool,
      })
    );

    return () => {
      dispatch(expandTasksModel.actions.reset());
    };
  }, []);

  return (
    <div className={styles.root}>
      <img
        className={styles.image}
        src={images.Decorations.PageBgDecoration}
        alt="page decoration"
      />
      <TransitionFade className={styles.container}>
        {isPending && <div key={"Skeleton"}>{Skeleton}</div>}
        {!isPending && <div key={"Content"}>{Content}</div>}
      </TransitionFade>
    </div>
  );
};
