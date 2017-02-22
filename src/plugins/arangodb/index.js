import ArangoDb from 'arangojs';

import Bootstrap from './bootstrap';

const plugin = (server, options = {}, next) => {
  const url = options.url || `http://root:orange5@arangodb.fa7f362b.svc.dockerapp.io:8529`;
  const db = ArangoDb({ url, databaseName: 'villains' });

  return Bootstrap(db, ['villains'])
    .then(() => {
      console.log(`ArangoDB has been bootstrapped`);

      server.expose({ db });

      return next();
    })
    .catch(err => next(err));
};

plugin.attributes = {
  name: 'arango',
  version: '1.0.0'
};

export default plugin;