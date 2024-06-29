const { ActivityType, Client } = require("discord.js");
const botSchema = require("../../schemas/Presence");

module.exports =
  /**
   *
   * @param {Client} client
   */
  async (client) => {
    client.user.setPresence({
      activities: [{ name: "Bot is starting", type: ActivityType.Playing }],
      status: "idle",
    });

    setTimeout(async () => {
      let botSchemaData = await botSchema.findOne({
        ClientID: client.user.id,
      });

      if (!botSchemaData) {
        await botSchema.create({
          ClientID: client.user.id,
          Presences: [
            {
              Activity: [
                {
                  Name: "Bot is working",
                  Type: ActivityType.Playing,
                },
              ],
              Status: "online",
            },
          ],
        });

        botSchemaData = await botSchema.findOne({
          ClientID: client.user.id,
        });
      }

      // Set the regular presence for the first time
      const presences = botSchemaData.Presences;
      const presence = presences[Math.floor(Math.random() * presences.length)];

      client.user.setPresence({
        activities: [
          { name: presence.Activity[0].Name, type: presence.Activity[0].Type },
        ],
        status: presence.Status,
      });

      setInterval(async () => {
        const botSchemaData = await botSchema.findOne({
          ClientID: client.user.id,
        });
        const presences = botSchemaData.Presences;
        const presence =
          presences[Math.floor(Math.random() * presences.length)];

        client.user.setPresence({
          activities: [
            {
              name: presence.Activity[0].Name,
              type: presence.Activity[0].Type,
            },
          ],
          status: presence.Status,
        });
      }, 15_000); // (15000ms = 15 seconds)
    }, 5_000); // (5000ms = 5 seconds)
  };
