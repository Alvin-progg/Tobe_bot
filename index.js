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
  dps: [], // Changed from crossbow to dps
  scout: [],
};

// List of authorized user IDs
const authorizedUsers = new Set([
  '737458927926640711', // Replace with the first authorized user ID
  '1000433038267781120',
  '406841260146556929',
  '271074647829774347', // Replace with the second authorized user ID
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
      await interaction.reply({ content: 'You are not authorized to use this command.', ephemeral: true });
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
      dps: [], // Changed from crossbow to dps
      scout: [],
    };

    // Create an embed
    const embed = new EmbedBuilder()
      .setTitle("AVA RAID 10 MAN") // Dynamic title with current date and time
      .setDescription(`Hoster by **${interaction.member.user.tag}**`) // Include the member who executed the command
      .setColor('#0099ff') // Embed color
      .addFields(
        { name: '<:1handHammer:1323830703720366102> Hammer', value: `(${selectedMembers.hammer.length}/1)\n${selectedMembers.hammer.join('\n') || ''}`, inline: true }, // Hammer field
        { name: '<:IncubusMace:1323830714503794771> Incubus', value: `(${selectedMembers.incubus.length}/1)\n${selectedMembers.incubus.join('\n') || ''}`, inline: true }, // Incubus field
        { name: '<:GreatArcaneStaff:1323830700281040977> GreatArcane', value: `(${selectedMembers.greatArcane.length}/1)\n${selectedMembers.greatArcane.join('\n') || ''}`, inline: true }, // GreatArcane field
        { name: '<:ArcaneStaff:1323830681159336028> Arcane', value: `(${selectedMembers.arcane.length}/1)\n${selectedMembers.arcane.join('\n') || ''}`, inline: true }, // Arcane field
        { name: '<:HolyStaff:1323830707331530792> Holystaff', value: `(${selectedMembers.holystaff.length}/1)\n${selectedMembers.holystaff.join('\n') || ''}`, inline: true }, // Holystaff field
        { name: '<:EarthruneStaff:1323831201894760490> Earthrune', value: `(${selectedMembers.earthrune.length}/1)\n${selectedMembers.earthrune.join('\n') || ''}`, inline: true }, // Earthrune field
        { name: '<:1HCROSSBOW:1323830693352181832> DPS', value: `(${selectedMembers.dps.length}/4)\n${selectedMembers.dps.join('\n') || ''}`, inline: true }, // DPS field (changed from Crossbow)
        { name: '<:heckerbillionaire:1328380550985158726> Scout', value: `(${selectedMembers.scout.length}/1)\n${selectedMembers.scout.join('\n') || ''}`, inline: true }, // Scout field
      )
      .setFooter({ text: 'Created By • SchmertBulark' }); // Footer with custom text
      

    // Create a dropdown menu (select menu)
    const selectMenu = new StringSelectMenuBuilder()
      .setCustomId('role-menu') // Unique ID for the menu
      .setPlaceholder('Choose your role') // Placeholder text
      .addOptions(
        {
          label: 'Hammer',
          description: 'Join as a Hammer',
          value: 'hammer',
          emoji: { id: '1323830703720366102', name: '1handHammer' }, // Custom emoji for Hammer
        },
        {
          label: 'Incubus',
          description: 'Join as an Incubus',
          value: 'incubus',
          emoji: { id: '1323830714503794771', name: 'IncubusMace' }, // Custom emoji for Incubus
        },
        {
          label: 'GreatArcane',
          description: 'Join as a GreatArcane',
          value: 'greatArcane',
          emoji: { id: '1323830700281040977', name: 'GreatArcaneStaff' }, // Custom emoji for GreatArcane
        },
        {
          label: 'Arcane',
          description: 'Join as an Arcane',
          value: 'arcane',
          emoji: { id: '1323830681159336028', name: 'ArcaneStaff' }, // Custom emoji for Arcane
        },
        {
          label: 'Holystaff',
          description: 'Join as a Holystaff',
          value: 'holystaff',
          emoji: { id: '1323830707331530792', name: 'HolyStaff' }, // Custom emoji for Holystaff
        },
        {
          label: 'Earthrune',
          description: 'Join as an Earthrune',
          value: 'earthrune',
          emoji: { id: '1323831201894760490', name: 'EarthruneStaff' }, // Custom emoji for Earthrune
        },
        {
          label: 'DPS', // Changed from Crossbow to DPS
          description: 'Join as a DPS',
          value: 'dps',
          emoji: { id: '1323830693352181832', name: '1HCROSSBOW' }, // Custom emoji for DPS
        },
        {
          label: 'Scout',
          description: 'Join as a Scout',
          value: 'scout',
          emoji: { id: '1328380550985158726', name: 'heckerbillionaire' }, // Custom emoji for Scout
        },
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

    // Remove the member from their previous role (if any)
    for (const role in selectedMembers) {
      if (selectedMembers[role].includes(memberId)) {
        selectedMembers[role] = selectedMembers[role].filter((id) => id !== memberId); // Remove the member
      }
    }

    // Add the member to the newly selected role
    if (selectedMembers[selectedRole].length < (selectedRole === 'dps' ? 4 : 1)) {
      selectedMembers[selectedRole].push(memberId); // Add the member
    }

    // Create an updated embed
    const updatedEmbed = new EmbedBuilder()
      .setTitle("AVA RAID 10 MAN") // Dynamic title with current date and time
      .setDescription(`Command executed by **${interaction.member.user.tag}**`) // Include the member who executed the command
      .setColor('#0099ff') // Embed color
      .addFields(
        { name: '<:1handHammer:1323830703720366102> Hammer', value: `(${selectedMembers.hammer.length}/1)\n${selectedMembers.hammer.join('\n') || ''}`, inline: true }, // Hammer field
        { name: '<:IncubusMace:1323830714503794771> Incubus', value: `(${selectedMembers.incubus.length}/1)\n${selectedMembers.incubus.join('\n') || ''}`, inline: true }, // Incubus field
        { name: '<:GreatArcaneStaff:1323830700281040977> GreatArcane', value: `(${selectedMembers.greatArcane.length}/1)\n${selectedMembers.greatArcane.join('\n') || ''}`, inline: true }, // GreatArcane field
        { name: '<:ArcaneStaff:1323830681159336028> Arcane', value: `(${selectedMembers.arcane.length}/1)\n${selectedMembers.arcane.join('\n') || ''}`, inline: true }, // Arcane field
        { name: '<:HolyStaff:1323830707331530792> Holystaff', value: `(${selectedMembers.holystaff.length}/1)\n${selectedMembers.holystaff.join('\n') || ''}`, inline: true }, // Holystaff field
        { name: '<:EarthruneStaff:1323831201894760490> Earthrune', value: `(${selectedMembers.earthrune.length}/1)\n${selectedMembers.earthrune.join('\n') || ''}`, inline: true }, // Earthrune field
        { name: '<:1HCROSSBOW:1323830693352181832> DPS', value: `(${selectedMembers.dps.length}/4)\n${selectedMembers.dps.join('\n') || ''}`, inline: true }, // DPS field (changed from Crossbow)
        { name: '<:heckerbillionaire:1328380550985158726> Scout', value: `(${selectedMembers.scout.length}/1)\n${selectedMembers.scout.join('\n') || ''}`, inline: true }, // Scout field
      )
      .setFooter({ text: 'Created By • SchmertBulark' }); // Footer with custom text
      

    // Recreate the dropdown menu
    const selectMenu = new StringSelectMenuBuilder()
      .setCustomId('role-menu') // Unique ID for the menu
      .setPlaceholder('Choose your role') // Placeholder text
      .addOptions(
        {
          label: 'Hammer',
          description: 'Join as a Hammer',
          value: 'hammer',
          emoji: { id: '1323830703720366102', name: '1handHammer' }, // Custom emoji for Hammer
        },
        {
          label: 'Incubus',
          description: 'Join as an Incubus',
          value: 'incubus',
          emoji: { id: '1323830714503794771', name: 'IncubusMace' }, // Custom emoji for Incubus
        },
        {
          label: 'GreatArcane',
          description: 'Join as a GreatArcane',
          value: 'greatArcane',
          emoji: { id: '1323830700281040977', name: 'GreatArcaneStaff' }, // Custom emoji for GreatArcane
        },
        {
          label: 'Arcane',
          description: 'Join as an Arcane',
          value: 'arcane',
          emoji: { id: '1323830681159336028', name: 'ArcaneStaff' }, // Custom emoji for Arcane
        },
        {
          label: 'Holystaff',
          description: 'Join as a Holystaff',
          value: 'holystaff',
          emoji: { id: '1323830707331530792', name: 'HolyStaff' }, // Custom emoji for Holystaff
        },
        {
          label: 'Earthrune',
          description: 'Join as an Earthrune',
          value: 'earthrune',
          emoji: { id: '1323831201894760490', name: 'EarthruneStaff' }, // Custom emoji for Earthrune
        },
        {
          label: 'DPS', // Changed from Crossbow to DPS
          description: 'Join as a DPS',
          value: 'dps',
          emoji: { id: '1323830693352181832', name: '1HCROSSBOW' }, // Custom emoji for DPS
        },
        {
          label: 'Scout',
          description: 'Join as a Scout',
          value: 'scout',
          emoji: { id: '1328380550985158726', name: 'heckerbillionaire' }, // Custom emoji for Scout
        },
      );

    // Wrap the select menu in an ActionRow
    const row = new ActionRowBuilder().addComponents(selectMenu);

    // Update the message with the new embed and dropdown menu
    await interaction.update({ embeds: [updatedEmbed], components: [row] });
  }
});

// Log in to Discord
client.login(process.env.TOKEN);