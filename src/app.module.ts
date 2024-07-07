import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppDataSource } from './config/data-source';
import { UserModule } from './modules/users/users.module';
import { OrganisationModule } from './modules/organisation/organisation.module';
import { AuthModule } from './auth/auth.module';
import { AuthGuardModule } from './auth-guard/auth-guard.module';
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: async () => ({
        type: 'postgres',
        host: (AppDataSource.options as any).host,
        port: (AppDataSource.options as any).port,
        username: (AppDataSource.options as any).username,
        password: (AppDataSource.options as any).password,
        database: (AppDataSource.options as any).database,
        entities: AppDataSource.options.entities,
        synchronize: AppDataSource.options.synchronize,
        migrationsTableName: 'migration',
        migrations: ['src/migration/*.ts'],
        logging: AppDataSource.options.logging,
      }),
    }),

    // UserModule,
    OrganisationModule,
    AuthModule,
    AuthGuardModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
