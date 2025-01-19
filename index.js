const { Client, GatewayIntentBits, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] });
require('dotenv').config();

// Store the selected members for each role
let selectedMembers = {
  hammer: [],
  incubus: [],
  greatArcane: [],
  arcane: [],
  holystaff: [],
  earthrune: [],
  dps: [],
  scout: [],
};

// List of authorized user IDs
const authorizedUsers = new Set([
  '737458927926640711', // Replace with authorized user IDs
  '1000433038267781120',
  '406841260146556929',
  '271074647829774347',
]);

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('interactionCreate', async (interaction) => {
  // Handle the /raid command
  if (interaction.isCommand() && interaction.commandName === 'raid') {
    console.log('Handling /raid command');

    // Check if the user is authorized
    if (!authorizedUsers.has(interaction.user.id)) {
      await interaction.reply({ content: 'You are not authorized to use this command. Contact an admin for access.', ephemeral: true });
      return;
    }

    // Reset the selectedMembers object
    selectedMembers = {
      hammer: [],
      incubus: [],
      greatArcane: [],
      arcane: [],
      holystaff: [],
      earthrune: [],
      dps: [],
      scout: [],
    };

    // Create an embed
    const currentDate = new Date().toLocaleString();
    const embed = new EmbedBuilder()
      .setTitle(`AVA RAID 10 MAN - ${currentDate}`)
      .setDescription(`Hosted by **${interaction.member.user.tag}**`)
      .setColor('#0099ff')
      .addFields(
        { name: `<:1handHammer:1323830703720366102> Hammer (${selectedMembers.hammer.length}/1)`, value: `${selectedMembers.hammer.join('\n') || ' '}`, inline: true },
        { name: `<:IncubusMace:1323830714503794771> Incubus (${selectedMembers.incubus.length}/1)`, value: `${selectedMembers.incubus.join('\n') || ' '}`, inline: true },
        { name: `<:GreatArcaneStaff:1323830700281040977> GreatArcane (${selectedMembers.greatArcane.length}/1)`, value: `${selectedMembers.greatArcane.join('\n') || ' '}`, inline: true },
        { name: `<:ArcaneStaff:1323830681159336028> Arcane (${selectedMembers.arcane.length}/1)`, value: `${selectedMembers.arcane.join('\n') || ' '}`, inline: true },
        { name: `<:HolyStaff:1323830707331530792> Holystaff (${selectedMembers.holystaff.length}/1)`, value: `${selectedMembers.holystaff.join('\n') || ' '}`, inline: true },
        { name: `<:EarthruneStaff:1323831201894760490> Earthrune (${selectedMembers.earthrune.length}/1)`, value: `${selectedMembers.earthrune.join('\n') || ' '}`, inline: true },
        { name: `<:1HCROSSBOW:1323830693352181832> DPS (${selectedMembers.dps.length}/4)`, value: `${selectedMembers.dps.join('\n') || ' '}`, inline: true },
        { name: `<:heckerbillionaire:1328380550985158726> Scout (${selectedMembers.scout.length}/1)`, value: `${selectedMembers.scout.join('\n') || ' '}`, inline: true },
      )
      .setFooter({ text: 'BOT Created By • SchmertBulark' });

    // Create a dropdown menu (select menu)
    const selectMenu = new StringSelectMenuBuilder()
      .setCustomId('role-menu')
      .setPlaceholder('Choose your role')
      .addOptions(
        { label: 'Hammer', value: 'hammer', emoji: { id: '1323830703720366102', name: '1handHammer' } },
        { label: 'Incubus', value: 'incubus', emoji: { id: '1323830714503794771', name: 'IncubusMace' } },
        { label: 'GreatArcane', value: 'greatArcane', emoji: { id: '1323830700281040977', name: 'GreatArcaneStaff' } },
        { label: 'Arcane', value: 'arcane', emoji: { id: '1323830681159336028', name: 'ArcaneStaff' } },
        { label: 'Holystaff', value: 'holystaff', emoji: { id: '1323830707331530792', name: 'HolyStaff' } },
        { label: 'Earthrune', value: 'earthrune', emoji: { id: '1323831201894760490', name: 'EarthruneStaff' } },
        { label: 'DPS', value: 'dps', emoji: { id: '1323830693352181832', name: '1HCROSSBOW' } },
        { label: 'Scout', value: 'scout', emoji: { id: '1328380550985158726', name: 'heckerbillionaire' } },
        { label: 'Remove Role', value: 'remove', emoji: '❌' }, // Add "Remove Role" option
      );

    // Wrap the select menu in an ActionRow
    const row = new ActionRowBuilder().addComponents(selectMenu);

    // Send the embed and dropdown menu
    await interaction.reply({ embeds: [embed], components: [row] });
  }

  // Handle dropdown menu interactions
  if (interaction.isStringSelectMenu() && interaction.customId === 'role-menu') {
    console.log('Handling dropdown menu interaction');
    const selectedRole = interaction.values[0]; // Get the selected role
    const member = interaction.member; // Get the member who selected the role
    const memberId = `<@${member.user.id}>`; // Member mention

    // Handle "Remove Role" option
    if (selectedRole === 'remove') {
      // Remove the member from all roles
      for (const role in selectedMembers) {
        if (selectedMembers[role].includes(memberId)) {
          selectedMembers[role] = selectedMembers[role].filter((id) => id !== memberId); // Remove the member
        }
      }
    } else {
      // Remove the member from their previous role (if any)
      for (const role in selectedMembers) {
        if (selectedMembers[role].includes(memberId)) {
          selectedMembers[role] = selectedMembers[role].filter((id) => id !== memberId); // Remove the member
        }
      }

      // Check if the selected role is full
      if (selectedMembers[selectedRole].length >= (selectedRole === 'dps' ? 4 : 1)) {
        await interaction.reply({ content: `The ${selectedRole} role is already full.`, ephemeral: true });
        return;
      }

      // Add the member to the newly selected role
      selectedMembers[selectedRole].push(memberId);
    }

    // Create an updated embed
    const updatedEmbed = new EmbedBuilder()
      .setTitle("AVA RAID 10 MAN")
      .setDescription(`Hosted by **${interaction.member.user.tag}**`)
      .setColor('#0099ff')
      .addFields(
        { name: `<:1handHammer:1323830703720366102> Hammer (${selectedMembers.hammer.length}/1)`, value: `${selectedMembers.hammer.join('\n') || ' '}`, inline: true },
        { name: `<:IncubusMace:1323830714503794771> Incubus (${selectedMembers.incubus.length}/1)`, value: `${selectedMembers.incubus.join('\n') || ' '}`, inline: true },
        { name: `<:GreatArcaneStaff:1323830700281040977> GreatArcane (${selectedMembers.greatArcane.length}/1)`, value: `${selectedMembers.greatArcane.join('\n') || ' '}`, inline: true },
        { name: `<:ArcaneStaff:1323830681159336028> Arcane (${selectedMembers.arcane.length}/1)`, value: `${selectedMembers.arcane.join('\n') || ' '}`, inline: true },
        { name: `<:HolyStaff:1323830707331530792> Holystaff (${selectedMembers.holystaff.length}/1)`, value: `${selectedMembers.holystaff.join('\n') || ' '}`, inline: true },
        { name: `<:EarthruneStaff:1323831201894760490> Earthrune (${selectedMembers.earthrune.length}/1)`, value: `${selectedMembers.earthrune.join('\n') || ' '}`, inline: true },
        { name: `<:1HCROSSBOW:1323830693352181832> DPS (${selectedMembers.dps.length}/4)`, value: `${selectedMembers.dps.join('\n') || ' '}`, inline: true },
        { name: `<:heckerbillionaire:1328380550985158726> Scout (${selectedMembers.scout.length}/1)`, value: `${selectedMembers.scout.join('\n') || ' '}`, inline: true },
      )
      .setFooter({ text: 'BOT Created By • SchmertBulark' });

    // Recreate the dropdown menu
    const selectMenu = new StringSelectMenuBuilder()
      .setCustomId('role-menu')
      .setPlaceholder('Choose your role')
      .addOptions(
        { label: 'Hammer', value: 'hammer', emoji: { id: '1323830703720366102', name: '1handHammer' } },
        { label: 'Incubus', value: 'incubus', emoji: { id: '1323830714503794771', name: 'IncubusMace' } },
        { label: 'GreatArcane', value: 'greatArcane', emoji: { id: '1323830700281040977', name: 'GreatArcaneStaff' } },
        { label: 'Arcane', value: 'arcane', emoji: { id: '1323830681159336028', name: 'ArcaneStaff' } },
        { label: 'Holystaff', value: 'holystaff', emoji: { id: '1323830707331530792', name: 'HolyStaff' } },
        { label: 'Earthrune', value: 'earthrune', emoji: { id: '1323831201894760490', name: 'EarthruneStaff' } },
        { label: 'DPS', value: 'dps', emoji: { id: '1323830693352181832', name: '1HCROSSBOW' } },
        { label: 'Scout', value: 'scout', emoji: { id: '1328380550985158726', name: 'heckerbillionaire' } },
        { label: 'Remove Role', value: 'remove', emoji: '❌' }, // Add "Remove Role" option
      );

    // Wrap the select menu in an ActionRow
    const row = new ActionRowBuilder().addComponents(selectMenu);

    // Update the message with the new embed and dropdown menu
    try {
      await interaction.update({ embeds: [updatedEmbed], components: [row] });
    } catch (error) {
      if (error.code === 10062) { // Unknown interaction
        await interaction.followUp({ content: 'This interaction has expired. Please use the command again.', ephemeral: true });
      } else {
        console.error('Error updating interaction:', error);
      }
    }
  }
});

// Log in to Discord
client.login(process.env.TOKEN);