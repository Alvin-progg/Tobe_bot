const { REST, Routes } = require('discord.js');
require('dotenv').config();

const clientId = process.env.clientId;
const guildId = '1315556360649314335'; // Add your guild ID for testing
const commands = [

  {
    name: 'raid', // Add your new command here
    description: 'creats raid ',
  },
];

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
  try {
    console.log('Registering commands...');
    await rest.put(
      Routes.applicationGuildCommands(clientId, guildId), // Register for a specific guild
      { body: commands }
    );
    console.log('Commands registered!');
  } catch (error) {
    console.error('Error registering commands:', error);
  }
})();