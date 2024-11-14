import {NestFactory} from "@nestjs/core";
import {AppModule} from "./app.module";

async function start() {
    const PORT = process.env.PORT;
    const app = await NestFactory.create(AppModule);

    app.enableCors({
        origin: 'http://localhost:8081', // Дозволений домен (наприклад, фронтенд на localhost:3000)
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Дозволені методи
        // credentials: true
    });

    await app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
}

start().then();