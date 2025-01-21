const { Client, GatewayIntentBits, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] });
const express = require('express');
require('dotenv').config();

const app = express();

app.get('/', (req, res) => res.send('Bot is running'));

app.listen(process.env.PORT || 3000, () => console.log('HTTP server is running'));

// Constants
const ROLE_LIMITS = {
  hammer: 1,
  incubus: 1,
  greatArcane: 1,
  arcane: 1,
  holystaff: 1,
  earthrune: 1,
  dps: 4,
  scout: 1,
};

const EMOJI_IDS = {
  hammer: '1323830703720366102',
  incubus: '1323830714503794771',
  greatArcane: '1323830700281040977',
  arcane: '1323830681159336028',
  holystaff: '1323830707331530792',
  earthrune: '1323831201894760490',
  dps: '1323830693352181832',
  scout: '1328380550985158726',
};

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

// Load authorized users from environment variables
const authorizedUsers = new Set((process.env.AUTHORIZED_USERS || '').split(','));

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

// Helper function to create the raid embed
function createRaidEmbed(selectedMembers, hostUser, utcTime) {
  return new EmbedBuilder()
    .setTitle("AVA RAID 10 MAN")
    .setDescription(`Hosted by **${hostUser}**\nUTC Time: **${utcTime}**`)
    .setColor('#0099ff')
    .addFields(
      { name: `<:1handHammer:${EMOJI_IDS.hammer}> Hammer (${selectedMembers.hammer.length}/${ROLE_LIMITS.hammer})`, value: `${selectedMembers.hammer.join('\n') || ' '}`, inline: true },
      { name: `<:IncubusMace:${EMOJI_IDS.incubus}> Incubus (${selectedMembers.incubus.length}/${ROLE_LIMITS.incubus})`, value: `${selectedMembers.incubus.join('\n') || ' '}`, inline: true },
      { name: `<:GreatArcaneStaff:${EMOJI_IDS.greatArcane}> GreatArcane (${selectedMembers.greatArcane.length}/${ROLE_LIMITS.greatArcane})`, value: `${selectedMembers.greatArcane.join('\n') || ' '}`, inline: true },
      { name: `<:ArcaneStaff:${EMOJI_IDS.arcane}> Arcane (${selectedMembers.arcane.length}/${ROLE_LIMITS.arcane})`, value: `${selectedMembers.arcane.join('\n') || ' '}`, inline: true },
      { name: `<:HolyStaff:${EMOJI_IDS.holystaff}> Holystaff (${selectedMembers.holystaff.length}/${ROLE_LIMITS.holystaff})`, value: `${selectedMembers.holystaff.join('\n') || ' '}`, inline: true },
      { name: `<:EarthruneStaff:${EMOJI_IDS.earthrune}> Earthrune (${selectedMembers.earthrune.length}/${ROLE_LIMITS.earthrune})`, value: `${selectedMembers.earthrune.join('\n') || ' '}`, inline: true },
      { name: `<:1HCROSSBOW:${EMOJI_IDS.dps}> DPS (${selectedMembers.dps.length}/${ROLE_LIMITS.dps})`, value: `${selectedMembers.dps.join('\n') || ' '}`, inline: true },
      { name: `<:heckerbillionaire:${EMOJI_IDS.scout}> Scout (${selectedMembers.scout.length}/${ROLE_LIMITS.scout})`, value: `${selectedMembers.scout.join('\n') || ' '}`, inline: true },
    )
    .setFooter({ text: 'BOT Created By • SchmertBulark' });
}

// Helper function to create the role selection menu
function createRoleMenu() {
  return new StringSelectMenuBuilder()
    .setCustomId('role-menu')
    .setPlaceholder('Choose your role')
    .addOptions(
      { label: 'Hammer', value: 'hammer', emoji: { id: EMOJI_IDS.hammer, name: '1handHammer' } },
      { label: 'Incubus', value: 'incubus', emoji: { id: EMOJI_IDS.incubus, name: 'IncubusMace' } },
      { label: 'GreatArcane', value: 'greatArcane', emoji: { id: EMOJI_IDS.greatArcane, name: 'GreatArcaneStaff' } },
      { label: 'Arcane', value: 'arcane', emoji: { id: EMOJI_IDS.arcane, name: 'ArcaneStaff' } },
      { label: 'Holystaff', value: 'holystaff', emoji: { id: EMOJI_IDS.holystaff, name: 'HolyStaff' } },
      { label: 'Earthrune', value: 'earthrune', emoji: { id: EMOJI_IDS.earthrune, name: 'EarthruneStaff' } },
      { label: 'DPS', value: 'dps', emoji: { id: EMOJI_IDS.dps, name: '1HCROSSBOW' } },
      { label: 'Scout', value: 'scout', emoji: { id: EMOJI_IDS.scout, name: 'heckerbillionaire' } },
      { label: 'Remove Role', value: 'remove', emoji: '❌' },
    );
}

// Register slash commands
const { REST, Routes } = require('discord.js');
const commands = [
  {
    name: 'raid',
    description: 'Start a raid with a UTC time',
    options: [
      {
        name: 'utc',
        description: 'The UTC time for the raid',
        type: 3, // STRING type
        required: true, // Make it mandatory
      },
    ],
  },
];

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
  try {
    await rest.put(Routes.applicationCommands('YOUR_CLIENT_ID'), { body: commands });
    console.log('Slash commands registered successfully!');
  } catch (error) {
    console.error('Error registering slash commands:', error);
  }
})();

client.on('interactionCreate', async (interaction) => {
  // Handle the /raid command
  if (interaction.isCommand() && interaction.commandName === 'raid') {
    console.log('Handling /raid command');

    // Check if the user is authorized
    if (!authorizedUsers.has(interaction.user.id)) {
      await interaction.reply({ content: 'You are not authorized to use this command. Contact an admin for access.', ephemeral: true });
      return;
    }

    // Get the UTC time from the command option
    const utcTime = interaction.options.getString('utc');

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

    // Create the embed with the UTC time and user mention
    const embed = createRaidEmbed(selectedMembers, interaction.user.toString(), utcTime);
    const selectMenu = createRoleMenu();
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
      if (selectedMembers[selectedRole].length >= ROLE_LIMITS[selectedRole]) {
        await interaction.reply({ content: `The ${selectedRole} role is already full.`, ephemeral: true });
        return;
      }

      // Add the member to the newly selected role
      selectedMembers[selectedRole].push(memberId);
    }

    // Create an updated embed and role menu
    const updatedEmbed = createRaidEmbed(selectedMembers, interaction.user.toString(), interaction.options.getString('utc'));
    const selectMenu = createRoleMenu();
    const row = new ActionRowBuilder().addComponents(selectMenu);

    // Update the message with the new embed and dropdown menu
    try {
      await interaction.update({ embeds: [updatedEmbed], components: [row] });
    } catch (error) {
      console.error('Error updating interaction:', error);
      if (error.code === 10062) { // Unknown interaction
        await interaction.followUp({ content: 'This interaction has expired. Please use the command again.', ephemeral: true });
      } else {
        await interaction.followUp({ content: 'An error occurred while updating the interaction.', ephemeral: true });
      }
    }
  }
});

// Log in to Discord
client.login(process.env.TOKEN);