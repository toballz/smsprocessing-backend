import { sessions } from '../../global/functions.js';
import db_pool from '../../global/database.js';


export async function claimPendingMessages_sql(limit = 10) {
    const safeLimit = Math.min(Math.max(parseInt(limit, 10) || 10, 1), 100);

    const sql = `
    WITH cte AS (
      SELECT id_ai
      FROM textmessages
      WHERE status = 'pending'
      ORDER BY created_at
      LIMIT $1
      FOR UPDATE SKIP LOCKED
    )
    UPDATE textmessages t
    SET status = 'processing',
        updated_on = NOW()
    FROM cte
    WHERE t.id_ai = cte.id_ai
    RETURNING t.*;
  `;

    const { rows } = await db_pool.query(sql, [safeLimit]);
    return rows; // array of claimed messages
}

export default async function getMessagesLists(limit = 5) {
    const response = { code: 200, message: 'ok', messages: {} };

    try {
        const claimedMessages = await claimPendingMessages_sql(limit);
        response.messages = claimedMessages;
        return response;
    } catch (error) {
        console.error('Error in get Messages Lists:', error);
        response.code = 500;
        response.message = 'Internal server error';
        return response;
    }
}