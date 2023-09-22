import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {productsProviders} from './data/product.provider';
import {DatabaseModule} from './database/database.module';


@Module({
    imports: [
        DatabaseModule,
    ],
    controllers: [AppController],
    providers: [AppService, ...productsProviders],
})
export class AppModule {
}
