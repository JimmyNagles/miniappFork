export type ResponseDefault<T> = {
  error: boolean;
  payload: T;
};

export type BrandedType<K, T> = K & { __brand: T };

export enum RouterPathes {
  WALLET_LOGIN = "/wallet-login",
  ON_BOARDING = "/on-boarding",
  MAIN = "/",
  POINTS = "/points",
  REFERRALS = "/referrals",
  LEADERBOARD = "/leaderboard",
  CHALLENGES = "/challenges",
  TRANSACTIONS = "/transactions",
  TOTAL_REFERRALS = "/total-referrals",
  PHOTO_TASK = "/photo-task/:id",
  VIDEO_TASK = "/video-task/:id",
  AUDIO_TASK = "/audio-task/:id",
  VALIDATION = "/validation/:id",
  OTHER = "/other",
  POINTS_INFO = "/points-info",
  TASKS = "/tasks",
  TASK = "/task/:id",
}

export type PropsDefault<T = unknown> = {
  className?: string;
} & T;

export type PropsDefaultWithChildren<T = unknown> = React.PropsWithChildren<
  {
    className?: string;
  } & T
>;

export type TimeStamp = BrandedType<number, "Timestamp">;
