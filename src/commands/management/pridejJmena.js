const { SlashCommandBuilder } = require('discord.js');
const VerifiedName = require('../../models/VerifiedName'); // Import modelu

module.exports = {
  data: new SlashCommandBuilder()
    .setName('pridej-jmena')
    .setDescription('Přidá více jmen do databáze ověřených jmen.')
    .addStringOption(option =>
      option
        .setName('jmena')
        .setDescription('Seznam jmen oddělených čárkou (např. Adam Gatner, Jan Novák).')
        .setRequired(true)),

  run: async ({ interaction }) => {
    // Získání seznamu jmen z příkazu
    const input = interaction.options.getString('jmena').trim();

    // Rozdělení seznamu jmen podle čárky a odstranění mezer kolem
    const names = input.split(',').map(name => name.trim());

    try {
      const namePattern = /^[A-ZÁČĎÉĚÍŇÓŘŠŤÚŮÝŽ][a-záčďéěíňóřšťúůýž]+\s[A-ZÁČĎÉĚÍŇÓŘŠŤÚŮÝŽ][a-záčďéěíňóřšťúůýž]+$/;

      // Odfiltrování jmen ve špatném formátu
      const invalidNames = names.filter(name => !namePattern.test(name));
      if (invalidNames.length > 0) {
        return interaction.reply({
          content: `Některá jména nejsou ve správném formátu: ${invalidNames.join(', ')}. Použijte formát "Jméno Příjmení" s velkými písmeny.`,
          ephemeral: true
        });
      }

      // Přidání jmen do databáze
      const results = await Promise.all(
        names.map(async (name) => {
          const existingName = await VerifiedName.findOne({ name });
          if (!existingName) {
            await VerifiedName.create({ name });
            return { name, added: true };
          } else {
            return { name, added: false };
          }
        })
      );

      // Rozdělení výsledků na přidaná a existující jména
      const addedNames = results.filter(result => result.added).map(result => result.name);
      const skippedNames = results.filter(result => !result.added).map(result => result.name);

      let replyMessage = '';
      if (addedNames.length > 0) {
        replyMessage += `✅ Přidaná jména: ${addedNames.join(', ')}\n`;
      }
      if (skippedNames.length > 0) {
        replyMessage += `⚠️ Přeskočená jména (už existují): ${skippedNames.join(', ')}`;
      }

      await interaction.reply({
        content: replyMessage || 'Nebylo přidáno žádné nové jméno.',
        ephemeral: true
      });
    } catch (error) {
      console.error('Chyba při přidávání jmen:', error);
      await interaction.reply({
        content: 'Došlo k chybě při přidávání jmen do databáze.',
        ephemeral: true
      });
    }
  },

  options: {
    devOnly: true,
    userPermissions: ['Administrator'], // Pouze administrátoři
    botPermissions: [],
    deleted: false,
    testOnly: true,
  },
};
