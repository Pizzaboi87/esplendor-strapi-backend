export default (plugin: any) => {
  // Update route middleware
  const originalRoutes = plugin.routes['content-api'].routes;
  plugin.routes['content-api'].routes = originalRoutes.map((route: any) => {
    if (route.method === 'PUT' && route.path === '/users/:id') {
      return {
        ...route,
        config: {
          ...route.config,
          middlewares: [
            async (ctx: any, next: () => Promise<any>) => {
              const { user } = ctx.state;
              const { id } = ctx.params;

              // Check if user is logged in
              if (!user) {
                return ctx.unauthorized('Authentication required');
              }

              // Admin check
              const isAdmin = user.role?.type === 'admin' || user.role?.name === 'Administrator';

              // If user is not admin and not the same user
              if (!isAdmin && user.id.toString() !== id.toString()) {
                return ctx.forbidden('You can only modify your own profile');
              }

              // Continue to the controller
              await next();
            },
          ],
        },
      };
    }
    return route;
  });

  // Update user controller
  plugin.controllers.user.update = async (ctx: any) => {
    const { id } = ctx.params;
    const { body } = ctx.request;
    const { user } = ctx.state;

    try {
      // Only allow certain fields to be updated
      const allowedFields = [
        'firstName',
        'lastName',
        'mobilePhone',
        'homePhone',
        'birthDate',
        'country',
        'address',
        'city',
        'zipCode',
        'discount',
        'used_coupons',
        'wishlist'
      ];

      const dataToUpdate = Object.keys(body).reduce((acc: any, key: string) => {
        if (allowedFields.includes(key)) {
          acc[key] = body[key];
        }
        return acc;
      }, {});

      // If no valid fields to update
      if (Object.keys(dataToUpdate).length === 0) {
        return ctx.badRequest('No valid fields to update');
      }

      const updatedUser = await strapi.entityService.update(
        'plugin::users-permissions.user',
        id,
        {
          data: dataToUpdate,
        }
      );

      // Sanitize user object
      const { password, resetPasswordToken, confirmationToken, ...sanitizedUser } = updatedUser;

      return ctx.send(sanitizedUser);
    } catch (error) {
      return ctx.badRequest('Update failed', { error: error.message });
    }
  };

  return plugin;
};