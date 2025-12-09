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
            'SELECT * FROM messages WHERE room_name = ?',
            [roomName]
        )

        return rows;
    }

    async getMessages(roomName : string) {
        const [rows] = await pool.execute<RowDataPacket[]>(
            'SELECT * FROM messages WHERE room_name = ?',
            [roomName]
        )

        return rows;
    }
}
