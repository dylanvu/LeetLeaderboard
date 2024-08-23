import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  CacheType,
  SlashCommandOptionsOnlyBuilder,
} from "discord.js";

interface ICommand {
  name: string;
  data: SlashCommandBuilder | SlashCommandOptionsOnlyBuilder;
  execute: (interaction: ChatInputCommandInteraction<CacheType>) => void;
}

const pingCommandName = "ping";
const pingCommand: ICommand = {
  name: pingCommandName,
  data: new SlashCommandBuilder()
    .setName(pingCommandName)
    .setDescription("Replies with Pong!"),
  execute: (interaction) => {
    interaction.reply("Pong!");
  },
};

// command to add points
interface ISubmission {
  name: string;
  points: number;
  value: string;
}
const submissionDirectory = [
  { name: "Job Application", points: 1, value: "Job Application" },
  {
    name: "Side Project Work Session",
    points: 2,
    value: "Side Project Work Session",
  },
  { name: "Leetcode Question", points: 5, value: "Leetcode Question" },
  {
    name: "OA/Interview for Company",
    points: 10,
    value: "OA/Interview for Company",
  },
  {
    name: "Side Project",
    points: 20,
    value: "Side Project",
  },
  { name: "Offer Secured", points: 100, value: "Offer Secured" },
];
const submitCommandName = "submit";
const submitCommand: ICommand = {
  name: submitCommandName,
  data: new SlashCommandBuilder()
    .setName(submitCommandName)
    .setDescription("Submit points for doing stuff")
    .addStringOption((option) =>
      option
        .setName("category")
        .setDescription("Choose a category to submit to")
        .setRequired(true)
        .addChoices(
          submissionDirectory.map((submission: ISubmission) => {
            return { name: submission.name, value: submission.value };
          })
        )
    ),
  execute: (interaction) => {
    interaction.options.getString("category");
    // obtain the number of points for the category
    const submissionType = submissionDirectory.find(
      (submission) =>
        submission.value === interaction.options.getString("category")
    );

    if (submissionType === undefined) {
      interaction.reply(
        "This is a broken category. Please contact the bot developer."
      );
      return;
    } else {
      interaction.reply(
        `**${interaction.options.getString("category")}** finished! **${
          submissionType.points
        } points have been added.**`
      );
    }
  },
};

const commandDirectory: Record<string, ICommand> = {
  ping: pingCommand,
  submit: submitCommand,
};
export default commandDirectory;
