import { Entity, EntityRepositoryType, PrimaryKey, Property } from '@mikro-orm/core';
import { UserRepository } from '../user.repository';

@Entity({ repository: () => UserRepository })
export class User {
  [EntityRepositoryType]?: UserRepository;

  @PrimaryKey()
  id: number;

  @Property({ unique: true })
  username: string;

  @Property()
  hashedPassword: string;

  @Property()
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  constructor(data: Partial<User>) {
    Object.assign(this, data);
  }
}
