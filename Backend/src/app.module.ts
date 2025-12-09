import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { UsersModule } from './users/users.module';
import { ChatModule } from './chat/chat.module';
import { join } from 'path';


@Module({
  imports: [
    UsersModule,
    ChatModule,
    // ServeStaticModule.forRoot({
    //   rootPath: join(__dirname, '..', 'nuxt-dist')
    // }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads', // 브라우저에서 접근할 URL prefix
    }),
  ]
})
export class AppModule {}
