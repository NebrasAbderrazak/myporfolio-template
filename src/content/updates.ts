import "server-only";
import { cache } from "react";
import { updateSchema } from "./schema";
import { readCollection } from "./source";

const showDrafts = process.env.NODE_ENV === "development";

export const getUpdates = cache(() =>
  readCollection("updates", updateSchema)
    .filter((update) => showDrafts || !update.draft)
    .sort((a, b) => b.date.localeCompare(a.date)),
);

export type Update = ReturnType<typeof getUpdates>[number];
