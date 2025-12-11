import { Injectable } from '@nestjs/common';
import { pool } from '../database';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

@Injectable()
export class ChatService {
    async sendMessage(fromId : number, toId : number, content : string, roomName : string) {
        const [result] = await pool.execute<ResultSetHeader>(
            'INSERT INTO messages (room_name, sender_id, receiver_id, content, status) VALUES (?, ?, ?, ?, ?)',
            [roomName, fromId, toId, content, 'sent']
        );

        const [rows] = await pool.execute<RowDataPacket[]>(
            'SELECT * FROM messages WHERE id = ?',
            [result.insertId]
        );

        return rows;
    }

    async getMessages(roomName : string) {
        const [rows] = await pool.execute<RowDataPacket[]>(
            'SELECT * FROM messages WHERE room_name = ?',
            [roomName]
        )

        return rows;
    }

    async checkStatus(fromId: number, toId: number, roomName: string) {
        const [rows] = await pool.execute<RowDataPacket[]>(
            'SELECT id, status FROM messages WHERE sender_id = ? AND receiver_id = ? AND room_name = ?',
            [toId, fromId, roomName]
        );

        for (const item of rows) {
            if (item.status !== "sent") continue;

            await pool.execute(
                'UPDATE messages SET status = ? WHERE id = ?',
                ['delivered', item.id]
            );
        }
    }

    async readMessage(fromId : number, toId: number, roomName: string) {
        const [result] = await pool.execute<ResultSetHeader>(
            `UPDATE messages SET status = 'read' WHERE sender_id = ? AND receiver_id = ? AND room_name = ? AND status != 'read'`,
            [toId, fromId, roomName]
        );
    }
}
