import { Core } from '@strapi/strapi';

export default {
  register({ strapi }: { strapi: Core.Strapi }) {
    const extensionService = strapi.plugin('graphql').service('extension');

    extensionService.use(({ strapi, nexus }) => ({
      types: [
        // Extend the UsersPermissionsMe type
        nexus.extendType({
          type: 'UsersPermissionsMe',
          definition(t) {
            t.string('firstName');
            t.string('lastName');
            t.string('mobilePhone');
            t.string('homePhone');
            t.string('birthDate');
            t.string('country');
            t.string('address');
            t.string('city');
            t.string('zipCode');
          },
        }),

        // Extend the UsersPermissionsUser type
        nexus.extendType({
          type: 'Query',
          definition(t) {
            // All orders for the currently logged in user
            t.list.field('orders', {
              type: 'Order',
              async resolve(parent, args, ctx) {
                const { state } = ctx;

                if (!state.user) {
                  throw new Error('You must be logged in to view your orders.');
                }

                try {
                  const orders = await strapi.entityService.findMany('api::order.order', {
                    filters: {
                      owner: state.user.id,
                    },
                    populate: ['owner', 'products'],
                  });

                  return orders;
                } catch (error) {
                  console.error('Error fetching orders:', error);
                  throw new Error('Failed to fetch orders.');
                }
              },
            });

            // Details of a specific order
            t.field('order', {
              type: 'Order',
              args: {
                id: nexus.nonNull(nexus.idArg())
              },
              async resolve(parent, args, ctx) {
                const { state } = ctx;

                if (!state.user) {
                  throw new Error('You must be logged in to view order details.');
                }

                try {
                  const order = await strapi.entityService.findOne('api::order.order', args.id, {
                    populate: ['owner', 'products'],
                  });

                  if (!order) {
                    throw new Error('Order not found.');
                  }

                  if (order.owner.id !== state.user.id) {
                    throw new Error('You can only view your own orders.');
                  }

                  return order;
                } catch (error) {
                  console.error('Error fetching order:', error);
                  throw new Error('Failed to fetch order details.');
                }
              },
            });
          },
        }),

        // Extend the Mutation type
        nexus.extendType({
          type: 'Mutation',
          definition(t) {
            // Update the currently logged in user
            t.field('updateUsersPermissionsUser', {
              type: 'UsersPermissionsUser',
              args: {
                id: nexus.nonNull(nexus.idArg()),
                data: nexus.nonNull(nexus.arg({ type: 'UsersPermissionsUserInput' })),
              },
              async resolve(parent, args, ctx) {
                const { state } = ctx;
                const requestingUserId = state.user?.id;

                if (!requestingUserId) {
                  throw new Error('You must be logged in to update user data.');
                }

                if (requestingUserId.toString() !== args.id.toString()) {
                  throw new Error('You can only update your own user data.');
                }

                const isAdmin = state.user?.role?.type === 'admin';
                if (!isAdmin && args.data.role) {
                  throw new Error('Only administrators can modify user roles.');
                }

                try {
                  const updatedUser = await strapi.entityService.update(
                    'plugin::users-permissions.user',
                    args.id,
                    {
                      data: args.data,
                    }
                  );

                  return updatedUser;

                } catch (error) {
                  console.error('Error updating user:', error);
                  throw new Error('An error occurred while updating the user.');
                }
              },
            });


            // New mutation to create an order
            t.field('createOrder', {
              type: 'Order',
              args: {
                data: nexus.nonNull(nexus.arg({ type: 'OrderInput' }))
              },
              async resolve(parent, args, ctx) {
                const { state } = ctx;

                if (!state.user) {
                  throw new Error('You must be logged in to create an order.');
                }

                try {
                  // Create the new order
                  const newOrder = await strapi.entityService.create('api::order.order', {
                    data: {
                      ...args.data,
                      owner: state.user.id,
                    },
                    populate: ['owner', 'products'],
                  });

                  console.log("Created Order:", newOrder);

                  // Return the new order
                  return newOrder;
                } catch (error) {
                  console.error('Error creating order:', error);
                  throw new Error('Failed to create order.');
                }
              },
            });

          },
        }),
      ],
    }));
  },

  bootstrap() { },
};