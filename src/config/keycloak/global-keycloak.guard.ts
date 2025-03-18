import { APP_GUARD } from '@nestjs/core';
import { AuthGuard, ResourceGuard, RoleGuard } from 'nest-keycloak-connect';

export const GlobalKeycloakGuard = {
  // This adds a global level authentication guard,
  // you can also have it scoped
  // if you like.
  //
  // Will return a 401 unauthorized when it is unable to
  // verify the JWT token or Bearer header is missing.
  keycloakAuth: {
    provide: APP_GUARD,
    useClass: AuthGuard,
  },

  // This adds a global level resource guard, which is permissive.
  // Only controllers annotated with @Resource and
  // methods with @Scopes
  // are handled by this guard.
  keycloakResource: {
    provide: APP_GUARD,
    useClass: ResourceGuard,
  },

  // New in 1.1.0
  // This adds a global level role guard, which is permissive.
  // Used by `@Roles` decorator with the
  // optional `@AllowAnyRole` decorator for allowing any
  // specified role passed.
  keycloakRole: {
    provide: APP_GUARD,
    useClass: RoleGuard,
  },
};
