import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { LoggingInterceptor } from './local/interceptor/logging.interceptor'
import { ErrorsInterceptor } from './local/interceptor/errors.interceptor'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-auth-token");
    res.header("Access-Control-Expose-Headers", "x-auth-token");
    next()
  })
  //Khai bao bien toan cuc cho router duong di
  app.setGlobalPrefix('api')

  //Khai bao su dung swagger
  const config = new DocumentBuilder()
    .setTitle('Smart-Meeting API')
    .setDescription('The Smart-Meeting API description')
    .setVersion('1.0')
    .addTag('smart-meeting')
    //Day la noi thiet lap them token access
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'Token' }, 'access-token'
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  /** 
   ràng buộc logic bổ sung trước / sau khi thực thi phương thức
   biến đổi kết quả trả về từ một hàm
   biến đổi exception được ném ra từ một hàm
   mở rộng hành vi function cơ bản
   ghi đè hoàn toàn một function tùy thuộc vào các điều kiện cụ thể (ví dụ: cho mục đích lưu vào bộ nhớ đệm)
   */
  //Interceptor có quyền truy cập vào request/ response trước và sau khi handler route được gọi.
  app.useGlobalInterceptors(new LoggingInterceptor());
  // app.useGlobalInterceptors(new ErrorsInterceptor());

  const port = Number(process.env.PORT) || 3000;
  await app.listen(port, () => {
    console.log(`listening on port ${port}`)
  });
}
bootstrap();
