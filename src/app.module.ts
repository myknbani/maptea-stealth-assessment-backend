import { MikroOrmModule } from '@mikro-orm/nestjs';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { AppController } from './app.controller';
import { AppResolver } from './app.resolver';
import { AppService } from './app.service';
import { LeadsModule } from './leads/leads.module';
import mikroOrmConfig from './orm/mikro-orm.config';
import { AuthModule } from './auth/auth.module';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { Config } from './config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MikroOrmModule.forRootAsync({
      inject: [Config],
      useFactory: (config: Config) => ({
        driver: PostgreSqlDriver,
        ...mikroOrmConfig,
        clientUrl: config.databaseUrl,
      }),
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      graphiql: true,
      autoSchemaFile: true,
      includeStacktraceInErrorResponses: process.env.NODE_ENV !== 'production',
    }),
    LeadsModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService, AppResolver, Config],
})
export class AppModule {}
