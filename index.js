import { Client, GatewayIntentBits } from 'discord.js';
import { config } from 'dotenv';
import { scheduleReminders } from './reminderScheduler.js';
import { handleAddAss } from './commands/addAss.js';
import { handleShowAss } from './commands/showAss.js';
import { handleSetReminderEmail } from './commands/setMyEmail.js'; // Import the new command
import { sendEmail } from './helpers/emailHandler.js';
config();
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
  scheduleReminders(client);
});

client.on('messageCreate', async message => {
  if (message.author.bot) return; // Ignore bot messages

  if (message.content.startsWith('!addAss')) {
    await handleAddAss(message);
  } else if (message.content.startsWith('!showAss')) {
    await handleShowAss(message);
  } else if (message.content.startsWith('!setMyEmail')) {
    await handleSetReminderEmail(message); 
  } else if (message.content.startsWith('!sendTestEmail')) {
    const [_, email] = message.content.split(' ').map(x => x.trim());
    await sendEmail(email, "Test Email", "Testing email server", message); 
  }
  

});

client.login(process.env.DISCORD_TOKEN);