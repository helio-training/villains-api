import ArangoDb from 'arangojs';

import Bootstrap from './bootstrap';

const plugin = (server, options = {}, next) => {

  const url = options.url || `http://root:orange5@localhost:8529`;
  const db = ArangoDb({ url, databaseName: 'villains' });

  console.log(options);

  return Bootstrap(db, ['villains'])
    .then(() => {
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
