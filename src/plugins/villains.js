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
            const { db } = request.server.plugins.arangodb;
            const villains = db.collection('villains');

            const results = await villains.all();
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
          return reply([]);
        }
      }
    },
    {
      method: 'GET',
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
          return reply({});
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
          return reply({});
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
          return reply({});
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
