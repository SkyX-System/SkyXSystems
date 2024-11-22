const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('rules')  

    .setDescription('Displays server rules.'),

  run: async ({ interaction }) => {
    const embed = new EmbedBuilder()
    .setTitle("*Vítejte na na našem serveru*")
    .setAuthor({
      name: "Miky_tvcz",
    })
    .setFooter({
      text: "Tento server je v souladu s Discord Terms of Service a Discord guidelines které lze najít na následujícím odkazu: https://discord.com/guidelines",
      iconURL:
        "https://static-cdn.jtvnw.net/jtv_user_pictures/51a42063-aee7-434b-872b-7590f5282f06-profile_image-70x70.png",
    })
    .setTimestamp()
    .setColor("#1F8B4C")
    .addFields(
      {
        name: "Prosíme dodržujte základní pravidla slušného chování.",
        value: "\u200B",
        inline: false,
      },
      {
        name: "Vedení tohoto serveru si vyhrazuje veškerá práva.",
        value: "\u200B",
        inline: false,
      },
      {
        name: "Je zakázáno provokovat, urážet, používat nadávky či narážky a vyvolávat hádky. Šikana má zde NULOVOU toleranci.",
        value: "\u200B",
        inline: false,
      },
      {
        name: "Je zakázáno projevovat rasismus, xenofobii, nacismus či homofobii nebo extrémistické názory.",
        value: "\u200B",
        inline: false,
      },
      {
        name: "Je zakázáno posílat jakékoliv odkazy či soubory, které jsou škodlivé či nevhodné.",
        value: "\u200B",
        inline: false,
      },
      {
        name: `Je zakázaný jakýkoliv typ spamu či floodu - více jak 3 stejné zprávy za sebou jsou považované za spam.`,
        value: "\u200B",
      },
      {
        name: `Zveřejňování odkazů přesměrujících na dárky, škodlivý obsah, obsah pro dospělé nebo hanlivý obsah jsou ZAKÁZANÉ.`,
        value: "\u200B",
      },
      {
        name: `Prosíme respektuje názor druhých lidí.`,
        value: "\u200B",
      },
      {
        name: `Žádná nahota. Do chatů nezveřejňujte žádné obrázky se sexuálním podtextem nebo nahotou.`,
        value: "\u200B",
      },
      {
        name: `Pravidla se mohou kdykoli změnit. O těchto změnách budou všichni řádně informováni.`,
        value: "\u200B",
      }
    );

    await interaction.reply({ embeds: [embed] });
  },

  options: {
    devOnly: false,
    userPermissions: [PermissionFlagsBits.Administrator],
    deleted: true,
    testServer: false,
  },
};