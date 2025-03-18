import { Logger } from '@nestjs/common';
import KeycloakAdminClient from '@keycloak/keycloak-admin-client';
import { ConfigService } from '@nestjs/config';
import { Credentials } from '@keycloak/keycloak-admin-client/lib/utils/auth';
import UserRepresentation from '@keycloak/keycloak-admin-client/lib/defs/userRepresentation';
import { RoleMappingPayload } from '@keycloak/keycloak-admin-client/lib/defs/roleRepresentation';

export class KeycloakAdminService {
  private readonly kcLogger = new Logger(KeycloakAdminService.name);

  constructor(readonly configService: ConfigService) {}

  async findUserById(id: string, kcAdminClient?: KeycloakAdminClient) {
    kcAdminClient = kcAdminClient || (await this.auth());
    this.kcLogger.log(`Finding user to KeyCloak by id (${id}) -> Begin`);

    try {
      const user = await kcAdminClient.users.findOne({ id: id });
      if (user) {
        this.kcLogger.log(`Finding user to KeyCloak by id (${id}) -> Success`);
        return user;
      }

      this.kcLogger.log(`Finding user to KeyCloak by id (${id}) -> Not found`);
      return undefined;
    } catch (e) {
      this.kcLogger.error(`Finding user to KeyCloak by id (${id}) -> Error: ${e}`);
      throw e;
    }
  }

  async findUserByEmail(email: string, kcAdminClient?: KeycloakAdminClient) {
    kcAdminClient = kcAdminClient || (await this.auth());
    this.kcLogger.log(`Finding user to KeyCloak by email (${email}) -> Begin`);

    try {
      const foundUsers = await kcAdminClient.users.find({ email: email });
      if (foundUsers?.length > 0) {
        this.kcLogger.log(`Finding user to KeyCloak by email (${email}) -> Success`);
        return foundUsers[0];
      }

      this.kcLogger.log(`Finding user to KeyCloak by email (${email}) -> Not found`);
      return undefined;
    } catch (e) {
      this.kcLogger.error(`Finding user to KeyCloak by email (${email}) -> Error: ${e}`);
      throw e;
    }
  }

  async create(user: UserRepresentation, realmRoles?: RoleMappingPayload[], kcAdminClient?: KeycloakAdminClient) {
    kcAdminClient = kcAdminClient || (await this.auth());
    this.kcLogger.log(`Creating user to KeyCloak -> Begin`);

    let userCreated: { id: string };
    try {
      userCreated = await kcAdminClient.users.create(user);
      this.kcLogger.log(`Creating user to KeyCloak -> Success`);
    } catch (e) {
      this.kcLogger.error(`Creating user to KeyCloak -> Error: ${e}`);
      throw e;
    }

    await this.addRealmRoles(userCreated.id, realmRoles, kcAdminClient);

    try {
      await this.executeActionsEmail(userCreated.id, kcAdminClient);
    } catch (e) {}

    return await this.findUserById(userCreated.id, kcAdminClient);
  }

  async update(
    id: string,
    user: UserRepresentation,
    realmRoles?: RoleMappingPayload[],
    kcAdminClient?: KeycloakAdminClient,
  ) {
    kcAdminClient = kcAdminClient || (await this.auth());
    this.kcLogger.log(`Updating user to KeyCloak -> Begin`);

    try {
      await kcAdminClient.users.update({ id: id }, user);
      this.kcLogger.log(`Updating user to KeyCloak -> Success`);
    } catch (e) {
      this.kcLogger.error(`Updating user to KeyCloak -> Error: ${e}`);
      throw e;
    }

    await this.addRealmRoles(id, realmRoles, kcAdminClient);

    return await this.findUserById(id, kcAdminClient);
  }

  async exclude(id: string, kcAdminClient?: KeycloakAdminClient) {
    kcAdminClient = kcAdminClient || (await this.auth());
    this.kcLogger.log(`Deleting user to KeyCloak -> Begin`);

    try {
      await kcAdminClient.users.del({ id: id });
      this.kcLogger.log(`Deleting user to KeyCloak -> Success`);
    } catch (e) {
      this.kcLogger.error(`Deleting user to KeyCloak -> Error: ${e}`);
      throw e;
    }
  }

  async executeActionsEmail(id: string, kcAdminClient?: KeycloakAdminClient) {
    kcAdminClient = kcAdminClient || (await this.auth());

    this.kcLogger.log(`Executing email actions to KeyCloak -> Begin`);
    try {
      const user = await this.findUserById(id, kcAdminClient);

      const actions = user.requiredActions;
      await this.update(user.id, {
        requiredActions: actions,
      });

      await kcAdminClient.users.executeActionsEmail({
        id: user.id,
        lifespan: this.configService.get<number>('keycloakConfig.emailLifespan'),
        actions: actions, // user.requiredActions,
      });

      this.kcLogger.log(`Executing email actions to KeyCloak -> Success`);
    } catch (e) {
      this.kcLogger.error(`Executing email actions to KeyCloak -> Error: ${e}`);
      throw e;
    }
  }

  async auth() {
    this.kcLogger.log(`Authenticate to KeyCloak -> Begin`);
    try {
      const kcAdminClient: KeycloakAdminClient = new KeycloakAdminClient({
        baseUrl: this.configService.get<string>('keycloakConfig.authServerUrl'),
        realmName: this.configService.get<string>('keycloakConfig.realm'),
      });

      const credentials = this.configService.get<Credentials>('keycloakAdminConfig');

      await kcAdminClient.auth(credentials);

      this.kcLogger.log(`Authenticate to KeyCloak -> Success`);
      return kcAdminClient;
    } catch (e) {
      this.kcLogger.error(`Authenticate to KeyCloak -> Error: ${e}`);
      throw e;
    }
  }

  private async addRealmRoles(userId: string, realmRoles: RoleMappingPayload[], kcAdminClient: KeycloakAdminClient) {
    if (!realmRoles?.length) return;

    this.kcLogger.log(`Adding Realm Roles to user -> Begin`);

    try {
      await kcAdminClient.users.addRealmRoleMappings({
        id: userId,
        realm: kcAdminClient.realmName,
        roles: realmRoles,
      });
    } catch (e) {
      this.kcLogger.error(`Adding Realm Roles to user -> Error: ${e}`);
      throw e;
    }

    this.kcLogger.log(`Adding Realm Roles to user -> End`);
  }
}
