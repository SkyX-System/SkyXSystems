const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('zadost-role')
    .setDescription('Požádat o roli.')
    .addStringOption(option =>
      option
        .setName('role')
        .setDescription('Název role, o kterou žádáte.')
        .setRequired(true)
    ),

  run: async ({ interaction, client }) => {
    const { guild, options, member } = interaction;



    // Zkontrolujte, zda má uživatel roli "ověřeno"
    const verifiedRoleId = '1255979423388270707';
    if (!member.roles.cache.has(verifiedRoleId)) {
      return await interaction.reply({ content: 'Musíte být ověřeni, abyste mohli žádat o role. ***Použij /ověř-mě***', ephemeral: true });
    }

    try {
      const roleName = options.getString('role');
      const role = guild.roles.cache.find(role => role.name === roleName);

      if (!role) {
        return await interaction.reply({ content: `Role "${roleName}" neexistuje.`, ephemeral: true });
      }

      // Zkontrolovat, zda má bot oprávnění k přidání role
      const botMember = guild.members.cache.get(client.user.id);
      if (!botMember.permissions.has(PermissionFlagsBits.ManageRoles)) {
        return await interaction.reply({ content: 'Nemám oprávnění spravovat role.', ephemeral: true });
      }

      // Zkontrolovat, zda role, kterou se snažíme přidat, má nižší prioritu než role bota
      if (role.position >= botMember.roles.highest.position) {
        return await interaction.reply({ content: 'Nelze přidat tuto roli, protože má vyšší nebo stejnou prioritu jako moje nejvyšší role.', ephemeral: true });
      }

      const embed = new EmbedBuilder()
        .setThumbnail(member.user.avatarURL())
        .setColor('#00FF00') // Zvolte barvu embed
        .setTitle("Žádost o Roli")
        .addFields(
          { name: 'Jméno:', value: member.user.username, inline: false },
          { name: 'Žádaná role:', value: roleName, inline: false },
          { name: 'ID:', value: member.user.id, inline: false },
          { name: 'Datum:', value: new Date().toLocaleString(), inline: false }, // Přidání názvu žádané role
        );

      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId('accept-role')
          .setEmoji('✅')
          .setStyle(ButtonStyle.Success)
          .setLabel('Schválit'),
        new ButtonBuilder()
          .setCustomId('decline-role')
          .setEmoji('❌')
          .setStyle(ButtonStyle.Danger)
          .setLabel('Odmítnout')
      );

      await interaction.reply({ embeds: [embed], components: [row], ephemeral: false });

      const filter = (i) => i.member.permissions.has(PermissionFlagsBits.Administrator);

      const collector = interaction.channel.createMessageComponentCollector({ filter, max: 1, time: 600000000 }); // Nastavte časový limit pro reakci (v milisekundách)

      collector.on('collect', async (i) => {
        if (i.customId === 'accept-role') {
          await member.roles.add(role);
          await i.update({ content: `Uživateli ${member.user.username} byla přidělena role ${roleName}.`, components: [] });
        } else if (i.customId === 'decline-role') {
          await i.update({ content: `Žádost o roli ${roleName} od uživatele ${member.user.username} byla zamítnuta.`, components: [] });
        } else {
          await i.reply({ content: 'Nemáte oprávnění schvalovat nebo odmítat žádosti o roli.', ephemeral: true });
        }
      });

      collector.on('end', async () => {
        try {
          const message = await interaction.fetchReply();
          await message.edit({ components: [] }); // Odstranění tlačítek po uplynutí času
        } catch (error) {
          console.error('Failed to edit message after collector ended:', error);
        }
      });
    } catch (error) {
      console.error(error); // Zaznamenání chyby do konzole
      await interaction.reply({ content: 'Při zpracování vaší žádosti došlo k chybě. Zkuste to prosím později.', ephemeral: true });
    }
  },
  options: {
    devOnly: true,
    deleted: false,
  },
};
