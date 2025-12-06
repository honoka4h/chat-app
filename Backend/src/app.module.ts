import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ChatGateway } from './chat.gateway';
import { join } from 'path';

@Module({
  imports: [
    UsersModule,
    // ServeStaticModule.forRoot({
    //   rootPath: join(__dirname, '..', 'nuxt-dist')
    // }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads', // 브라우저에서 접근할 URL prefix
    }),
  ],
  controllers: [AppController],
  providers: [AppService, ChatGateway],
})
export class AppModule {}
