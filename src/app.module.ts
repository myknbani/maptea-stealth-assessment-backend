import { MikroOrmModule } from '@mikro-orm/nestjs';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { AppConfigModule } from './app-config/app-config.module';
import { Config } from './app-config/config';
import { AppController } from './app.controller';
import { AppResolver } from './app.resolver';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { LeadsModule } from './leads/leads.module';
import mikroOrmConfig from './orm/mikro-orm.config';

@Module({
  imports: [
    MikroOrmModule.forRootAsync({
      imports: [AppConfigModule],
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
  providers: [AppService, AppResolver],
})
export class AppModule {}
