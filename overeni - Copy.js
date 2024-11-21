const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

// Seznam ověřených jmen
const verifiedNames = ["Jan Novák", "Petr Svoboda", "Anna Kovářová", "Adam Gatner"];

module.exports = {
  data: new SlashCommandBuilder()
  .setName('oveř-mě')
  .setDescription('Ověřte se jako člen tábora.'),
  
  run: async ({ interaction }) => {
    const { member } = interaction;
    const nickname = member.nickname; // Get the Discord nickname

    try {
      // Extract the name from the nickname (remove everything before and after the quotes)
      const name = nickname.match(/"([^"]+)"/)[1];

      // Check if the extracted name exists in the verifiedNames array
      if (verifiedNames.includes(name)) {
        // Přidejte roli "ověřeno" (změňte ID role na správné ID z vašeho serveru)
        const verifiedRoleId = '1255979423388270707';
        await member.roles.add(verifiedRoleId);

        await interaction.reply({ content: 'Byli jste ověřeni a role "ověřeno" vám byla přidělena.', ephemeral: true });
      } else {
        await interaction.reply({ content: 'Vaše jméno nebylo nalezeno v databázi ověřených jmen.', ephemeral: true });
      }
    } catch (error) {
      // If the extraction fails or the nickname doesn't contain quotes, reply with an error message
      await interaction.reply({ content: 'Chyba při ověřování. Zkontrolujte, zda je váš nickname ve správném formátu.***VášNickName "Pepa Poklička"***', ephemeral: true });
    }
  },
};