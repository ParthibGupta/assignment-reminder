import cron from 'node-cron';
import { supabase } from './db.js';

/**
 * Runs every day at 9am server time
 * Sends reminders for assignments due in 7, 5, 3, or 1 day.
 */
export function scheduleReminders(client) {
  cron.schedule('0 9 * * *', async () => {
    const today = new Date();
    const reminderDays = [7, 5, 3, 1];

    for (let days of reminderDays) {
      const targetDate = new Date(today);
      targetDate.setDate(today.getDate() + days);
      const formattedDate = targetDate.toISOString().split('T')[0];

      const { data: assignments, error } = await supabase
        .from('assignments')
        .select('*')
        .eq('due_date', formattedDate);

      if (error) {
        console.error('Supabase error:', error);
        return;
      }

      for (let assignment of assignments) {
        const channel = await client.channels.fetch(assignment.channel_id);
        if (channel) {
          const mention = `<@${assignment.user_id}>`;
          channel.send(`📚 Reminder for ${mention}: **${assignment.title}** is due in ${days} day(s)!`);
        }
      }
    }
  });
}
