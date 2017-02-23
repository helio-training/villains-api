import Joi from 'joi';
import Boom from 'boom';

const VillainSchema = {
  name: Joi.string().trim().label('Name'),
  universe: Joi.string().trim().default('Marvel'),
  gender: Joi.string().trim().default('Male'),
  kind: Joi.string().trim().default('Mutant'),
  bio: Joi.string(),
  identity: {
    name: {
      first: Joi.string().trim(),
      last: Joi.string().trim(),
    },
    age: Joi.number().min(0)
  },
  isActive: Joi.boolean().default(true),
  nicknames: Joi.array().items(Joi.string()).unique(),
  rating: Joi.number().min(0).max(100).default(0)
};

const collection = async request => {
  const { db } = request.server.plugins['arangodb'];
  return db.collection('villains');
};

const plugin = (server, options, next) => {

  server.route([
    {
      method: 'GET',
      path: '/v1/villains',
      config: {
        tags: ['api']
      },
      handler: {
        async: async(request, reply) => {
          try {
            const villains = await collection(request);

            const cursor = await villains.all();
            const results = await cursor.all();

            return reply(results);
          } catch (e) {
            return Boom.badImplementation(e.message);
          }
        }
      }
    },
    {
      method: 'POST',
      path: '/v1/villains',
      config: {
        tags: ['api'],
        validate: {
          payload: Joi.object().keys(VillainSchema).requiredKeys('name')
        }
      },
      handler: {
        async: async(request, reply) => {
          try {
            const villain = request.payload;
            const collection = await collection(request);

            const result = await collection.save(villain, { returnNew: true });

            return reply(result).code(201);

          } catch (e) {
            return Boom.badImplementation(e.message);
          }
        }
      }
    },
    {
      method: 'GET',
      path: '/v1/villains/{id}',

      config: {
        tags: ['api'],
        // pre: [
        //   {
        //     method: {
        //       async: async(request, reply) => {
        //         const { id } = request.params;
        //
        //         const collection = await collection(request);
        //         const results = (await collection.lookupByKeys([id])) || [];
        //
        //         return reply(results.length > 0);
        //       }
        //     },
        //     assign: 'isFound'
        //   }
        // ],
        validate: {
          params: {
            id: Joi.string().required()
          }
        }
      },
      handler: {
        async: async(request, reply) => {
          try {
            const { id } = request.params;
            const collection = await collection(request);
            console.log(colllection);

            // if (!request.pre.isFound) {
            //   return reply(Boom.notFound('Villain not found', id));
            // }

            const villain = await collection.document(id);
            if(!villain) {
                return reply(Boom.notFound('Villain not found', id));
            }
            return reply(villain);
          } catch (e) {
            return Boom.badImplementation(e.message);
          }
        }
      }
    },
    {
      method: ['PATCH', 'PUT'],
      path: '/v1/villains/{id}',
      config: {
        tags: ['api'],
        validate: {
          params: {
            id: Joi.string().required()
          },
          payload: VillainSchema
        }
      },
      handler: {
        async: async(request, reply) => {

          try {
            const { id } = request.params;
            const { payload } = request;
            const collection = await collection(request);

            const villain = await collection.updateByExample({ _key: id }, payload);
            if (!villain) {
              return reply(Boom.notFound('Villain not found', id));
            }
            return reply(villain);
          } catch (e) {
            return Boom.badImplementation(e.message);
          }
        }
      }
    },
    {
      method: 'DELETE',
      path: '/v1/villains/{id}',
      config: {
        tags: ['api'],
        validate: {
          params: {
            id: Joi.string().required()
          }
        }
      },
      handler: {
        async: async(request, reply) => {

          try {
            const { id } = request.params;
            const collection = await collection(request);

            return reply({});

          } catch (e) {
            return Boom.badImplementation(e.message);
          }


        }
      }
    }
  ]);

  return next();
};

plugin.attributes = {
  name: 'villains',
  version: '1.0.0'
};

export default plugin;
