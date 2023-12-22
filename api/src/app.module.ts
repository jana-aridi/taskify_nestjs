import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { WorkspaceModule } from './workspace/workspace.module';
import { TaskModule } from './task/task.module';
import { JwtMiddleware } from './user/jwt/jwt.middleware';

@Module({

  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true
    }),

    MongooseModule.forRoot(process.env.DB),
    UserModule,
    WorkspaceModule,
    TaskModule
  ],

  controllers: [AppController],
  providers: [AppService],

})

export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(JwtMiddleware)
      .exclude(
        { path: '/login', method: RequestMethod.POST },
        { path: '/register', method: RequestMethod.POST },
      )
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
