import {
  GraduationCap,
  MessagesSquare,
  Mic,
  Repeat,
} from "lucide-react";

export const styleMeta = [
  {
    id: "teacher",
    label: "Teacher",
    icon: GraduationCap,
    desc: "Single narrator explains concepts",
  },
  {
    id: "conversation",
    label: "Conversation",
    icon: MessagesSquare,
    desc: "Two hosts discuss the topic",
  },
  {
    id: "interview",
    label: "Interview",
    icon: Mic,
    desc: "Q&A format with an expert guest",
  },
  {
    id: "revision",
    label: "Quick Revision",
    icon: Repeat,
    desc: "Fast recap of key points",
  },
];

export const voiceMeta = [
  {
    id: "male",
    label: "Male",
  },
  {
    id: "female",
    label: "Female",
  },
  {
    id: "mixed",
    label: "Mixed",
  },
];

export const durationMeta = [
  {
    id: "5",
    label: "5 min",
  },
  {
    id: "10",
    label: "10 min",
  },
  {
    id: "20",
    label: "20 min",
  },
];

export const styleLabel = {
  teacher: "Teacher",
  conversation: "Conversation",
  interview: "Interview",
  revision: "Quick Revision",
};