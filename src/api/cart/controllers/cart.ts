import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::cart.cart', ({ strapi }) => ({
    async find(ctx) {
        // Check if the user is logged in
        const user = ctx.state.user;
        if (!user) {
            return ctx.unauthorized('You must be logged in to view your cart.');
        }

        // Filter the carts by the current user
        const userId = user.id;
        ctx.query = {
            ...ctx.query,
            filters: { //@ts-ignore
                ...ctx.query.filters,
                user: userId,
            },
        };

        // Fetch the carts from the database
        const { data, meta } = await super.find(ctx);

        return { data, meta };
    },

    async findOne(ctx) {
        // Check if the user is logged in
        const user = ctx.state.user;
        if (!user) {
            return ctx.unauthorized('You must be logged in to view this cart.');
        }

        // Fetch the cart from the database
        const { id } = ctx.params;
        const entity = await strapi.entityService.findOne('api::cart.cart', id, {
            populate: ['user'],
        });

        // Check if the cart exists and belongs to the current user
        // @ts-ignore
        if (!entity || entity.user.id !== user.id) {
            return ctx.unauthorized('You are not authorized to view this cart.');
        }

        return { data: entity };
    },
}));
