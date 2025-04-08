import { supabase } from '../db.js';

export async function handleSetReminderEmail(message) {
  const [_, email] = message.content.split(' ').map(x => x.trim());

  if (!email || !email.includes('@')) {
    return message.reply('❌ Invalid email address. Please provide a valid email.');
  }

  // Insert or update the email for the user
  const { data, error } = await supabase
    .from('user_emails')
    .upsert({ user_id: message.author.id, email }, { onConflict: 'user_id' });

  if (error) {
    console.error('Database error:', error);
    return message.reply('❌ Failed to set your email. Please try again later.');
  }

  return message.reply(`✅ Your email address has been set to: ${email}`);
}