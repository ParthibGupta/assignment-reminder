import { supabase } from '../db.js';

export async function handleAddAss(message) {
  const [_, unitCode, title, deadline] = message.content.split(' ').map(x => x.trim());

  if (!unitCode || !title || !deadline) {
    return message.reply('Usage: `!addAss UNITCODE TITLE DEADLINE (DD-MM-YYYY)`');
  }

  // Validate and parse deadline
  const [day, month, year] = deadline.split('-').map(Number); // Split and convert to numbers
  const deadlineDate = new Date(year, month - 1, day); // Create a Date object (month is 0-indexed)

  if (isNaN(deadlineDate.getTime())) {
    return message.reply('❌ Invalid date format. Please use `DD-MM-YYYY`.');
  }

  const now = new Date();
  if (deadlineDate <= now) {
    return message.reply('❌ Deadline must be a future date.');
  }

  // Insert assignment into the database with user ID
  const { error } = await supabase.from('assignments').insert([{
    unit_code: unitCode,
    title,
    due_date: deadlineDate, 
    channel_id: message.channel.id,
    user_id: message.author.id // Store the user ID
  }]);

  if (error) {
    console.error('Insert error:', error);
    return message.reply('Error adding assignment.');
  }

  return message.reply(`✅ Assignment "${title}" for unit "${unitCode}" added with deadline ${deadline}. Assigned to <@${message.author.id}>.`);
}