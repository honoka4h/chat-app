import { Inject, Injectable, ConflictException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import * as argon2 from 'argon2';
import * as fs from 'fs';
import * as path from 'path';
import { NIL, v4 as uuidv4 } from 'uuid';
import { pool } from '../database';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

@Injectable()
export class UsersService {
  // 회원가입
  async register(username: string, password: string, email: string) {
    if (!username && !password && !email) {
        throw new BadRequestException("모든 칸을 작성해주세요.");
    }

    try {
        const [rows] = await pool.execute<RowDataPacket[]>(
            "SELECT * FROM users WHERE username = ? LIMIT 1",
            [username]
        );

        if (rows.length > 0 ) {
            throw new ConflictException("이미 동일한 아이디가 존재합니다.");
        }

        const hashed = await argon2.hash(password);
        const userid = await uuidv4();

        const [result] = await pool.execute<ResultSetHeader[]>(
            'INSERT INTO users (userid, username, password, email) VALUES (?, ?, ?, ?)',
            [userid, username, hashed, email]
        )

        return { message: "회원가입에 성공했습니다." }
    } catch(error: any) {
        if (error instanceof ConflictException) throw error;
        console.error(error);
        throw new InternalServerErrorException();
    }
  }

  // 로그인
  async login(username: string, password: string) {
    if (!username && !password ) {
        throw new BadRequestException("모든 칸을 작성해주세요.");
    }

    try {
        const [rows] = await pool.execute<RowDataPacket[]>(
            "SELECT * FROM users WHERE username = ? LIMIT 1",
            [username]
        );

        if (rows.length < 1) {
            throw new BadRequestException("아이디 또는 비밀번호가 일치하지 않습니다.");
        }

         const user = rows[0];
         const isMatch = await argon2.verify(user.password, password);

         if (!isMatch) {
            throw new BadRequestException("아이디 또는 비밀번호가 일치하지 않습니다.");
         }

         return {
            message: "로그인 성공",
            userid: user.userid,
            username: user.username,
            nickname: user.nickname,
            email: user.email,
         };
        
    } catch(error) {
        if (error instanceof ConflictException) throw error;
        console.error(error);
        throw new InternalServerErrorException();
    }
  }

  async updateUserProfile(username: string, nickname: string, profileImage: string) {
    const [rows] = await pool.execute(
      `SELECT profile_image FROM users WHERE username = ? LIMIT 1`,
      [username]
    );

    const oldImage = rows[0]?.profile_image;

    const finalNickname = nickname || username;
    const finalImage = profileImage || 'default-avatar.png';

    const sql = `
      UPDATE users
      SET nickname = ?, profile_image = ?
      WHERE username = ?
    `;
    await pool.execute(sql, [finalNickname, finalImage, username]);

    if (oldImage && !oldImage.includes('default-avatar')) {
      const filePath = path.join(process.cwd(), 'uploads', 'profiles', oldImage);
      fs.unlink(filePath, () => {});
    }

    return { username, nickname: finalNickname, profileImage: finalImage };
  }

  async getUserProfileImage(userid: string): Promise<string> {
    const sql = `SELECT profile_image FROM users WHERE userid = ? LIMIT 1`;
    const [rows] = await pool.execute<RowDataPacket[]>(sql, [userid]);

    if (!rows || rows.length === 0) return 'default-avatar.jpg';
    return rows[0].profile_image || 'default-avatar.jpg';
  }
}