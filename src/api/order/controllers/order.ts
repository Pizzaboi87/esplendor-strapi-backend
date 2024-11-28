import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::order.order', ({ strapi }) => ({
    async find(ctx) {
        // Check if the user is logged in
        const user = ctx.state.user;
        if (!user) {
            return ctx.unauthorized('You must be logged in to view your orders.');
        }

        // Filter the orders by the current user
        const userId = user.id;
        ctx.query = {
            ...ctx.query,
            filters: { //@ts-ignore
                ...ctx.query.filters,
                owner: userId,
            },
        };

        // Fetch the orders from the database
        const { data, meta } = await super.find(ctx);

        return { data, meta };
    },

    async findOne(ctx) {
        // Check if the user is logged in
        const user = ctx.state.user;
        if (!user) {
            return ctx.unauthorized('You must be logged in to view this order.');
        }

        // Fetch the order from the database
        const { id } = ctx.params;
        const entity = await strapi.entityService.findOne('api::order.order', id, {
            populate: ['owner'],
        });

        // Check if the order exists and belongs to the current user
        // @ts-ignore
        if (!entity || entity.owner.id !== user.id) {
            return ctx.unauthorized('You are not authorized to view this order.');
        }

        return { data: entity };
    },
}));
