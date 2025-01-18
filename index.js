const { Client, GatewayIntentBits, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] });
require('dotenv').config();
const express = require('express');
const app = express();

app.get('/', (req, res) => res.send('Bot is running'));

app.listen(process.env.PORT || 3000, () => console.log('HTTP server is running'));


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

    // Get the current date and time
    const now = new Date();
    const formattedDate = now.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const formattedTime = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

    // Create an embed
    const embed = new EmbedBuilder()
      .setTitle(`${formattedDate} ${formattedTime}`) // Dynamic title with current date and time
      .setDescription(`Command executed by **${interaction.member.user.tag}**`) // Include the member who executed the command
      .setColor('#0099ff') // Embed color
      .addFields(
        { name: 'Hammer', value: `(${selectedMembers.hammer.length}/1)\n${selectedMembers.hammer.join('\n') || 'None'}`, inline: true }, // Hammer field
        { name: 'Incubus', value: `(${selectedMembers.incubus.length}/1)\n${selectedMembers.incubus.join('\n') || 'None'}`, inline: true }, // Incubus field
        { name: 'GreatArcane', value: `(${selectedMembers.greatArcane.length}/1)\n${selectedMembers.greatArcane.join('\n') || 'None'}`, inline: true }, // GreatArcane field
        { name: 'Arcane', value: `(${selectedMembers.arcane.length}/1)\n${selectedMembers.arcane.join('\n') || 'None'}`, inline: true }, // Arcane field
        { name: 'Holystaff', value: `(${selectedMembers.holystaff.length}/1)\n${selectedMembers.holystaff.join('\n') || 'None'}`, inline: true }, // Holystaff field
        { name: 'Earthrune', value: `(${selectedMembers.earthrune.length}/1)\n${selectedMembers.earthrune.join('\n') || 'None'}`, inline: true }, // Earthrune field
        { name: 'DPS', value: `(${selectedMembers.dps.length}/4)\n${selectedMembers.dps.join('\n') || 'None'}`, inline: true }, // DPS field (changed from Crossbow)
        { name: 'Scout', value: `(${selectedMembers.scout.length}/1)\n${selectedMembers.scout.join('\n') || 'None'}`, inline: true }, // Scout field
      )
      .setFooter({ text: 'Created By • SchmertBulark' }) // Footer with custom text
      .setTimestamp(); // Add a timestamp to the embed

    // Create a dropdown menu (select menu)
    const selectMenu = new StringSelectMenuBuilder()
      .setCustomId('role-menu') // Unique ID for the menu
      .setPlaceholder('Choose your role') // Placeholder text
      .addOptions(
        {
          label: 'Hammer',
          description: 'Join as a Hammer',
          value: 'hammer',
        },
        {
          label: 'Incubus',
          description: 'Join as an Incubus',
          value: 'incubus',
        },
        {
          label: 'GreatArcane',
          description: 'Join as a GreatArcane',
          value: 'greatArcane',
        },
        {
          label: 'Arcane',
          description: 'Join as an Arcane',
          value: 'arcane',
        },
        {
          label: 'Holystaff',
          description: 'Join as a Holystaff',
          value: 'holystaff',
        },
        {
          label: 'Earthrune',
          description: 'Join as an Earthrune',
          value: 'earthrune',
        },
        {
          label: 'DPS', // Changed from Crossbow to DPS
          description: 'Join as a DPS',
          value: 'dps',
        },
        {
          label: 'Scout',
          description: 'Join as a Scout',
          value: 'scout',
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

    // Get the current date and time
    const now = new Date();
    const formattedDate = now.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const formattedTime = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

    // Create an updated embed
    const updatedEmbed = new EmbedBuilder()
      .setTitle(`${formattedDate} ${formattedTime}`) // Dynamic title with current date and time
      .setDescription(`Command executed by **${interaction.member.user.tag}**`) // Include the member who executed the command
      .setColor('#0099ff') // Embed color
      .addFields(
        { name: 'Hammer', value: `(${selectedMembers.hammer.length}/1)\n${selectedMembers.hammer.join('\n') || 'None'}`, inline: true }, // Hammer field
        { name: 'Incubus', value: `(${selectedMembers.incubus.length}/1)\n${selectedMembers.incubus.join('\n') || 'None'}`, inline: true }, // Incubus field
        { name: 'GreatArcane', value: `(${selectedMembers.greatArcane.length}/1)\n${selectedMembers.greatArcane.join('\n') || 'None'}`, inline: true }, // GreatArcane field
        { name: 'Arcane', value: `(${selectedMembers.arcane.length}/1)\n${selectedMembers.arcane.join('\n') || 'None'}`, inline: true }, // Arcane field
        { name: 'Holystaff', value: `(${selectedMembers.holystaff.length}/1)\n${selectedMembers.holystaff.join('\n') || 'None'}`, inline: true }, // Holystaff field
        { name: 'Earthrune', value: `(${selectedMembers.earthrune.length}/1)\n${selectedMembers.earthrune.join('\n') || 'None'}`, inline: true }, // Earthrune field
        { name: 'DPS', value: `(${selectedMembers.dps.length}/4)\n${selectedMembers.dps.join('\n') || 'None'}`, inline: true }, // DPS field (changed from Crossbow)
        { name: 'Scout', value: `(${selectedMembers.scout.length}/1)\n${selectedMembers.scout.join('\n') || 'None'}`, inline: true }, // Scout field
      )
      .setFooter({ text: 'Created By • SchmertBulark' }) // Footer with custom text
      .setTimestamp(); // Add a timestamp to the embed

    // Recreate the dropdown menu
    const selectMenu = new StringSelectMenuBuilder()
      .setCustomId('role-menu') // Unique ID for the menu
      .setPlaceholder('Choose your role') // Placeholder text
      .addOptions(
        {
          label: 'Hammer',
          description: 'Join as a Hammer',
          value: 'hammer',
        },
        {
          label: 'Incubus',
          description: 'Join as an Incubus',
          value: 'incubus',
        },
        {
          label: 'GreatArcane',
          description: 'Join as a GreatArcane',
          value: 'greatArcane',
        },
        {
          label: 'Arcane',
          description: 'Join as an Arcane',
          value: 'arcane',
        },
        {
          label: 'Holystaff',
          description: 'Join as a Holystaff',
          value: 'holystaff',
        },
        {
          label: 'Earthrune',
          description: 'Join as an Earthrune',
          value: 'earthrune',
        },
        {
          label: 'DPS', // Changed from Crossbow to DPS
          description: 'Join as a DPS',
          value: 'dps',
        },
        {
          label: 'Scout',
          description: 'Join as a Scout',
          value: 'scout',
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