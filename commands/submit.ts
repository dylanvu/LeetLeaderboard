import { ICommand } from "../commands";
import { SlashCommandBuilder } from "discord.js";
import { collection, IUser } from "../firebase";

// command to add points
interface ISubmission {
  name: string;
  points: number;
  value: string; // value should match the name of the category cuz that's how my code works :P
}
const submissionDirectory = [
  { name: "A Job Application", points: 1, value: "A Job Application" },
  {
    name: "A Side Project Work Session",
    points: 2,
    value: "A Side Project Work Session",
  },
  {
    name: "Updating Resume/LinkedIn",
    points: 2,
    value: "Updating Resume/LinkedIn",
  },
  { name: "A Leetcode Question", points: 5, value: "A Leetcode Question" },
  {
    name: "An OA/Interview for Company",
    points: 10,
    value: "An OA/Interview for Company",
  },
  {
    name: "A Side Project",
    points: 20,
    value: "A Side Project",
  },
  {
    name: "The Ultimate Goal: Offer Secured",
    points: 100,
    value: "The Ultimate Goal: Offer Secured",
  },
];

const submitCommandName = "submit";
const submitCommand: ICommand = {
  name: submitCommandName,
  data: new SlashCommandBuilder()
    .setName(submitCommandName)
    .setDescription("Get points for doing stuff")
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
  execute: async (interaction) => {
    interaction.options.getString("category");
    // obtain the number of points for the category
    const submissionType = submissionDirectory.find(
      (submission) =>
        submission.value === interaction.options.getString("category")
    );

    if (submissionType === undefined) {
      await interaction.reply(
        "This is a broken category. Please contact the bot developer."
      );
      return;
    } else {
      // figure out who the user is
      const user = interaction.user;

      // TODO: add a streak feature
      // get the current time
      const currentTime = new Date();

      // if you submit within 24 hours of your last submission, you get an additional streak bonus
      // formula: points bonus = (daily_streak * 0.1 * points)

      // figure out if this is a new user
      await collection
        .doc(user.id)
        .get()
        .then((doc) => {
          if (doc.exists) {
            // if the user exists, add the points
            const userDoc = doc.data();
            const userPoints = userDoc?.points;
            collection.doc(user.id).update({
              points: userPoints + submissionType.points,
            });
          } else {
            const userData: IUser = {
              points: submissionType.points,
              username: user.username,
              display_name: user.displayName,
              avatar_url: user.avatarURL() || "none",
            };
            // if the user doesn't exist, create the user
            collection.doc(user.id).set(userData);
          }
        });

      // reply with a confirmation
      const points = submissionType.points;
      await interaction.reply(
        `**${interaction.options.getString(
          "category"
        )}** finished! **${points} ${
          points === 1 ? "point" : "points"
        } have been added.**`
      );
    }
  },
};

export default submitCommand;
