const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('whois')
    .setDescription('Gets basic user info')
    .addUserOption(option => option.setName('target').setDescription('The user to get info for')),

  run: async ({ interaction, client, handler, }) => {
    const user = interaction.options.getUser('target');
    if (!user) {
      await interaction.reply({ content: 'You must provide a user to get info for.', ephemeral: true });
      return;
    }
    const member = await interaction.guild.members.fetch(user.id);
    if (!member) {
      await interaction.reply({ content: 'I cannot find that user in this server.', ephemeral: true });
      return;
    }
    const icon = user.displayAvatarURL();
    const tag = user.tag;
    const userFlags = user.flags.toArray();
    const formatter = new Intl.ListFormat('en-GB', { style: 'narrow', type: 'conjunction' });
    const badges = {
      BugHunterLevel1: 'Bug Hunter',
      BugHunterLevel2: 'Bug Buster',
      CertifiedModerator: 'Discord Certified Moderator',
      HypeSquadOnlineHouse1: 'House of Bravery',
      HypeSquadOnlineHouse2: 'House of Brilliance',
      HypeSquadOnlineHouse3: 'House of Balance',
      HypesquadEvents: 'HypeSquad Events Attendee',
      Partner: 'Discord Partner',
      PremiumEarlySupporter: 'Early Nitro Supporter',
      Staff: 'Discord Staff',
      VerifiedBot: 'Verified Bot',
      VerifiedDeveloper: 'Verified Developer',
      ActiveDeveloper: 'Active and Verified Developer',
      NitroClassic: 'Nitro Classic',
      Nitro: 'Nitro',
      ServerBoosterLevel1: 'Server Booster Level 1',
      ServerBoosterLevel2: 'Server Booster Level 2',
      ServerBoosterLevel3: 'Server Booster Level 3',
      ModeratorProgramAlumni: 'Moderator Program Alumni',
      EarlySupporter: 'Early Supporter',
      Quests: 'Quests'
  };

    const embed = new EmbedBuilder()
      .setColor('#00FF0C')
      .setAuthor({ name: `${tag}`, iconURL: `${icon}` })
      .setThumbnail(`${icon}`)
      .addFields({ name: 'Member', value: `${user}`, inline: false, })
      .addFields({ name: 'Roles', value: `${member.roles.cache.map((r) => r).join(' ')}`, inline: false, })
      .addFields({ name: 'Joined Server', value: `<t:${parseInt(member.joinedAt / 1000)}:R>`, inline: true, })
      .addFields({ name: 'Joined Discord', value: `<t:${parseInt(user.createdAt / 1000)}:R>`, inline: true, })
      .addFields({ name: 'Badges', value: userFlags.length ? formatter.format(userFlags.map((flag) => `**${badges[flag]}**`)) : 'None', })
      .setFooter({ text: `User id: ${user.id}`, })
      .setTimestamp();

    await interaction.reply({ embeds: [embed], });
  },

  options: {
    devOnly: false,
    userPermissions: [], // Add your required user permissions here
    botPermissions: [], // Add your required bot permissions here
    deleted: false,
  },
};