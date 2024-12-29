import { init, i } from "@instantdb/react";
const schema = i.schema({
  entities: {
    contacts: i.entity({
      name: i.string().unique(),
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
      forward: { on: "messages", has: "one", label: "contacts" },
      reverse: { on: "contacts", has: "many", label: "messages" },
    },
  },
});
export const db = init({
  appId: import.meta.env.VITE_INSTANTDB_KEY,
  schema,
});

export const getAllMessages = () => {
  const { data, isLoading, error } = db.useQuery({
    messages: {},
  });
  return data?.messages;
};
