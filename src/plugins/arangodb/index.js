import ArangoDb from 'arangojs';

import Bootstrap from './bootstrap';

const plugin = (server, options, next) => {

  const { collections = ['villains'], databaseName = 'villains', url = `http://root:orange5@localhost:8529` } = options;

  const db = ArangoDb({ url, databaseName });

  Bootstrap(db, collections)
    .then(() => {
      console.log(`ArangoDB has been bootstrapped`);

      server.expose({ db });

      return next();
    })
    .catch(err => next(err));
};

plugin.attributes = {
  name: 'arangodb',
  version: '1.0.0'
};

export default plugin;
