import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {

  const app = await NestFactory.create(AppModule);

  // adding cors to prevent unauthorized errors 
  const cors = require('cors');
 
  const corsOptions = {
    origin: 'http://localhost:3000', 
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: ['Content-Type', 'Accept', 'Authorization'],  
  };
  
  app.use(cors(corsOptions));
  
  await app.listen(8080);
}
bootstrap();
