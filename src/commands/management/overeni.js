const { SlashCommandBuilder } = require('discord.js');
const VerifiedName = require('../../models/VerifiedName'); // Import modelu

module.exports = {
  data: new SlashCommandBuilder()
    .setName('oveř-mě')
    .setDescription('Ověřte se jako člen tábora.'),

  run: async ({ interaction }) => {
    const { member } = interaction;

    let nickname = member.displayName.trim();

    try {
      console.log("Zjištěná přezdívka:", nickname);

      const namePattern = /^[A-ZÁČĎÉĚÍŇÓŘŠŤÚŮÝŽ][a-záčďéěíňóřšťúůýž]+\s[A-ZÁČĎÉĚÍŇÓŘŠŤÚŮÝŽ][a-záčďéěíňóřšťúůýž]+$/;
      if (!namePattern.test(nickname)) {
        throw new Error('Invalid format');
      }

      const foundName = await VerifiedName.findOne({ name: nickname });
      if (foundName) {
        const verifiedRole = '1255979423388270707';

        if (member.roles.cache.has(verifiedRole)) {
          await interaction.reply({ content: `Jméno "${nickname}" je již ověřeno jiným uživatelem na serveru.`, ephemeral: true });
        } else {
          await member.roles.add(verifiedRole);
          await interaction.reply({ content: 'Byli jste ověřeni a role "ověřeno" vám byla přidělena.', ephemeral: true });
        }
      } else {
        await interaction.reply({ content: 'Vaše jméno nebylo nalezeno v databázi ověřených jmen.', ephemeral: true });
      }
    } catch (error) {
      await interaction.reply({
        content: 'Chyba při ověřování. Vaše přezdívka musí být ve formátu: ***Adam Gatner*** (první písmena velká, pouze jedna mezera).',
        ephemeral: true
      });
    }
  },

  options: {
    devOnly: true,
    userPermissions: [],
    botPermissions: [],
    deleted: false,
  },
};
