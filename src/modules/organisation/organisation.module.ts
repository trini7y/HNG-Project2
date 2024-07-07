import { Module } from '@nestjs/common';
import { OrganisationService } from './organisation.service';
import { OrganisationController } from './organisation.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Organisation } from 'src/libs/entities/organisation.entity';
import { User } from 'src/libs/entities/users/users.entity';


@Module({
  imports: [TypeOrmModule.forFeature([Organisation, User])],
  controllers: [OrganisationController],
  providers: [OrganisationService],
  exports: [OrganisationService]
})
export class OrganisationModule {}
