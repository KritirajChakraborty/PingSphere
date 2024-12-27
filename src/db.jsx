import { init, i } from "@instantdb/react";
const schema = i.schema({
  entities: {
    contacts: i.entity({
      name: i.string().unique(),
      email: i.string(),
      userId: i.string(),
      createdAt: i.number(),
    }),
    messages: i.entity({
      text: i.string(),
      sender: i.string().indexed(),
      reciever: i.string(),
      createdAt: i.number(),
    }),
  },
  links: {
    messageContact: {
      forward: { on: "messages", has: "one", label: "contact" },
      reverse: { on: "contacts", has: "many", label: "messages" },
    },
  },
});
export const db = init({
  appId: import.meta.env.VITE_INSTANTDB_KEY,
  schema,
});
