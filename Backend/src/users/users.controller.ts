import { UseInterceptors, UploadedFile, Controller, Get, Post, Body, Req, Res, Param } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import multerConfig from '../multer.config'
import { UsersService } from './users.service';
import type { Express, Request, Response } from 'express';
import { pool } from '../database';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('login')
  async login(
    @Body() body: { username: string; password: string },
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const user = await this.usersService.login(body.username, body.password);

    req.session.user = {
      userid: user.userid,
      username: user.username,
      nickname: user.nickname,
      email: user.email,
    };

    console.log("로그인 성공!");

    return res.json({
      message: '로그인 성공',
      user: req.session.user,
    });
  }

  @Post('register')
  async register(
    @Body() body: { username: string; password: string; email: string },
  ) {
    return this.usersService.register(body.username, body.password, body.email);
  }

  @Get('checklogin')
  async checkLogin(@Req() req: Request) {
    if (req.session?.user) {
      return {
        loggedIn: true,
        username: req.session.user.username,
        userid: req.session.user.userid,
        nickname: req.session.user.nickname
      };
    }
    return { loggedIn: false };
  }

  @Post('logout')
  logout(@Req() req: Request, @Res() res: Response) {
    req.session.destroy((err) => {
      if (err) console.error(err);

      res.clearCookie('connect.sid', {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
      });

      return res.json({ message: '로그아웃 성공' });
    });
  }

  @Get('getUsers')
  async getUsers() {
    const [rows] = await pool.query('SELECT userid, username FROM users');
    return rows;
  }

  @Get('friendRequests')
  async getFriendRequests(@Req() req) {
    if (!req.session?.user) {
      return { success: false, message: '로그인 필요' };
    }

    const userId = req.session.user.userid;

    const [rows] = await pool.execute(
      `
      SELECT fr.id, fr.senderid, fr.receiverid, u.username AS sendername
      FROM friend_requests fr
      JOIN users u ON fr.senderid = u.userid
      WHERE fr.receiverid = ?
      ORDER BY fr.id DESC
      `,
      [userId]
    );

    return { success: true, requests: rows };
  }

  @Get('friends')
    async getFriends(@Req() req) {
    const userId = req.session?.user?.userid;
    const [rows] = await pool.execute(
      'SELECT user_min, user_max FROM friends WHERE user_min = ? OR user_max = ?',
      [userId, userId]
    );

    // 나 제외하고 상대방 userid 가져오기
    const friends = (rows as any[]).map(r => r.user_min === userId ? r.user_max : r.user_min);

    // 상대방 username 같이 가져오기
    const friendData: { userid: string; username: string }[] = [];
    for (const f of friends) {
      const [u] = await pool.execute('SELECT username FROM users WHERE userid = ? LIMIT 1', [f]);
      friendData.push({ userid: f, username: (u as any[])[0]?.username || 'Unknown' });
    }

    return { friends: friendData };
  }

  @Post('update')
  @UseInterceptors(FileInterceptor('file', multerConfig))
  async updateProfile(
    @Body('username') username: string,
    @Body('nickname') nickname: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const imagePath = file ? `${file.filename}` : 'default-avatar.jpg';
    const result = await this.usersService.updateUserProfile(username, nickname, imagePath);
    return { ok: true, result };
  }

  @Get(':userid/profile')
  async getProfileImage(@Param('userid') userid: string) {
    const profile = await this.usersService.getUserProfileImage(userid);

    return {
      profileImage: `${profile}`
    };
  }
}
