import {NestFactory} from "@nestjs/core";
import {AppModule} from "./app.module";
import { ValidationPipe } from '@nestjs/common';

async function start() {
    const PORT = process.env.PORT;
    const app = await NestFactory.create(AppModule);

    app.enableCors({
        origin: 'http://localhost:8081',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    });

    app.useGlobalPipes(new ValidationPipe());

    await app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
}

start().then();