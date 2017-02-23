import ArangoDb from 'arangojs';

import Bootstrap from './bootstrap';

const plugin = (server, options = {}, next) => {

  const url = options.url;
  const db = ArangoDb({ url, databaseName: 'villains' });
  server.expose({ db });

  console.log(options);

  return next();

  // return Bootstrap(db, ['villains'])
  //   .then(() => {
  //     return next();
  //   })
  //   .catch(err => next(err));
};

plugin.attributes = {
  name: 'arangodb',
  version: '1.0.0'
};

export default plugin;
