/**
 * ArangoDB Bootstrapper
 *
 * @public
 *
 * @param {Database} db
 * @param {String[]} collections
 *
 * @returns {Promise}
 */
export default async(db, collections = []) => {

  const databaseCollections = await db.listCollections();

  const createCollection = async(name) => {
    await db.collection(name).create();
  };


  for (let collection of collections.filter(collection => databaseCollections.includes(collection))) {
    await createCollection(collection);
  }
};

// export c (db) => {
//
//   return {
//     initialize(collections) {
//
//     }
//   }
// }
