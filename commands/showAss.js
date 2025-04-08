import { supabase } from '../db.js';

export async function handleShowAss(message) {
  // Fetch assignments for the user
  const { data: assignments, error } = await supabase
    .from('assignments')
    .select('*')
    .eq('user_id', message.author.id)
    .order('due_date', { ascending: true });

  if (error) {
    console.error('Fetch error:', error);
    return message.reply('Error fetching assignments.');
  }

  if (!assignments || assignments.length === 0) {
    return message.reply('You have no assignments.');
  }

  // Format assignments into a table
  let response = '📋 **Your Assignments:**\n';
  response += '```';
  response += 'Unit Code | Title               | Deadline\n';
  response += '------------------------------------------\n';
  assignments.forEach(assignment => {
    response += `${assignment.unit_code.padEnd(9)} | ${assignment.title.padEnd(18)} | ${assignment.due_date}\n`;
  });
  response += '```';

  return message.reply(response);
}