import 'express-session';

declare module 'express-session' {
  interface SessionData {
    user?: {
      userid: string;
      username: string;
      nickname: string;
    };
  }
}
