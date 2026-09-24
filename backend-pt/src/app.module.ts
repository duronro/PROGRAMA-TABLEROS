import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import basededatosConfig from './config/basededatos.config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { MaquinasModule } from './maquinas/maquinas.module';
import { ComponentesModule } from './componentes/componentes.module';
import { MantenimientosModule } from './mantenimientos/mant.module';
import { CargasModule } from './cargas/cargas.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [basededatosConfig]
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => 
        configService.get('database') as TypeOrmModuleOptions,
    }),
    MaquinasModule,
    ComponentesModule,
    MantenimientosModule,
    CargasModule,
  ],
  
})

export class AppModule {}
