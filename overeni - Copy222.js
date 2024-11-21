const { SlashCommandBuilder } = require('discord.js');

// Seznam ověřených jmen
const verifiedNames = new Set([
  "Jan Novák",
  "Petr Svoboda",
  "Anna Kovářová",
  "Adam Gatner"
]);

module.exports = {
  data: new SlashCommandBuilder()
    .setName('oveř-mě')
    .setDescription('Ověřte se jako člen tábora.'),
  
  run: async ({ interaction }) => {
    const { member } = interaction;
    const nickname = member.displayName; // Get the Discord nickname (changed from member.nickname to member.displayName)

    try {
      // Extract the name from the nickname (remove everything before and after the quotes)
      const name = nickname.match(/"([^"]+)"/)[1];

      // Check if the extracted name exists in the verifiedNames set
      if (verifiedNames.has(name)) {
        // Check if the user already has the verified role
        const verifiedRole = '1255979423388270707'; // Replace with the actual verified role ID
        if (member.roles.cache.has(verifiedRole)) {
          await interaction.reply({ content: `Jméno "${name}" je již ověřeno jiným uživatelem na serveru.`, ephemeral: true });
        } else {
          // Add the verified role
          await member.roles.add(verifiedRole);
          await interaction.reply({ content: 'Byli jste ověřeni a role "ověřeno" vám byla přidělena.', ephemeral: true });
        }
      } else {
        // Name is not in the verified names list
        await interaction.reply({ content: 'Vaše jméno nebylo nalezeno v databázi ověřených jmen.', ephemeral: true });
      }
    } catch (error) {
      // If the extraction fails or the nickname doesn't contain quotes, reply with an error message
      await interaction.reply({ content: 'Chyba při ověřování. Zkontrolujte, zda je váš nickname ve správném formátu. ***VášNickName "Pepa Poklička"***', ephemeral: true });
    }
  },
};
