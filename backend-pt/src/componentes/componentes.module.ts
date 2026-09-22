import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {ComponentesService} from './componentes.service';
import {ComponentesController} from './componentes.controller';
import {Componente} from './entidades/comp.entity';  

@Module({
    imports: [TypeOrmModule.forFeature([Componente])],
    controllers: [ComponentesController],
    providers: [ComponentesService],
    exports: [ComponentesService], 
})
export class ComponentesModule {}