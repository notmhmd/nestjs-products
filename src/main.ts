import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {MicroserviceOptions, Transport} from "@nestjs/microservices";
import {Logger} from "@nestjs/common";
import { v4 as uuid } from 'uuid';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule,{
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: ['kafka:9093'],
      },
      consumer: {
        groupId: `product-consumer`,
      },
    }
  });
  await app.listen().then(() => Logger.log('Product Service is listening'));
}
bootstrap();
