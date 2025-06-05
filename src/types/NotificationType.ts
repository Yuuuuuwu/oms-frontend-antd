import type { Dayjs } from "dayjs";

export type NotificationType = {
  id: number;
  title: string;
  description: string;
  read: boolean;
  type: "order" | "system" | "customer";
  link?: string;
  time: Dayjs;
};
