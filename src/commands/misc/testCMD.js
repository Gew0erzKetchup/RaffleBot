const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder  } = require("discord.js");
const mConfig = require("../../messageConfig.json");

const command = {
  data: new SlashCommandBuilder()
    .setName("test")
    .setDescription("Test if everything works.")
    .toJSON(),
  testMode: true,
  devOnly: true,
  deleted: false,
  userPermissions: [],
  botPermissions: [],

  run: async (client, interaction) => {
    try {
      const embed = new EmbedBuilder()
        .setTitle("Test Message")
        .setDescription("Everything seems to be working fine.")
        .setColor(mConfig.embedColorSuccess)

      await interaction.reply({ embeds: [embed], ephemeral: true });
    } catch (err) {
      console.log("[ERROR]".red + "Error in your testCMD.js run function:");
      console.log(err);
    }
  },

  autocomplete: async (client, interaction) => {
    try {
      //...

    } catch (err) {
      console.log("[ERROR]".red + "Error in your testCMD.js autocomplete function:");
      console.log(err);
    }
  }
};

module.exports = command;