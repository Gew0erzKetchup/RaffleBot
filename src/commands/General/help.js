const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const fs = require("fs");
const buttonPagination = require("../../utils/buttonPagination.js");
const mConfig = require("../../messageConfig.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Displays a list of commands."),
  run: async (client, interaction) => {
    try {
      const commandFolders = fs.readdirSync("./src/commands");
      const helpEmbeds = [];

      for (const folder of commandFolders) {
        const commandFiles = fs
          .readdirSync(`./src/commands/${folder}`)
          .filter((file) => file.endsWith(".js"));

        const categoryEmbed = new EmbedBuilder()
          .setTitle(folder)
          .setFooter({ text: `${mConfig.footerText}` })
          .setTimestamp()
          .setThumbnail(client.user.avatarURL())
          .setColor(mConfig.embedColor);

        const subcommands = [];

        for (const file of commandFiles) {
          const command = require(`./../${folder}/${file}`);

          if (command.deleted) {
            continue;
          }

          const description = `${
            command.data.description || "No description provided"
          }`;

          if (
            command.data.type === "SUB_COMMAND" ||
            command.data.type === "SUB_COMMAND_GROUP"
          ) {
            subcommands.push(command);
          } else {
            categoryEmbed.addFields({
              name: `/${command.data.name}`,
              value: `${description}`,
            });
          }
        }

        if (subcommands.length > 0) {
          categoryEmbed.addFields({
            name: `Subcommands`,
            value: subcommands
              .map((subcommand) => `/${subcommand.data.name}`)
              .join("\n"),
          });
        }

        helpEmbeds.push(categoryEmbed);
      }

      await buttonPagination(interaction, helpEmbeds);
    } catch (err) {
      console.log(err);
    }
  },
};
