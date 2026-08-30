import { MongoClient, Db } from "mongodb";

// Standard direct replica set URI fallback if SRV has DNS issues on local network
export const DEFAULT_MONGODB_URI = 
  "mongodb://anilarangi6_db_user:iDivTeL6FLG1qBqR@ac-jzecjd8-shard-00-00.nojrybz.mongodb.net:27017,ac-jzecjd8-shard-00-01.nojrybz.mongodb.net:27017,ac-jzecjd8-shard-00-02.nojrybz.mongodb.net:27017/trendy_baba?ssl=true&authSource=admin&retryWrites=true&w=majority";

const options = {};

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

let clientPromise: Promise<MongoClient> | null = null;

export async function getMongoClient(): Promise<MongoClient> {
  const uri = process.env.MONGODB_URI || DEFAULT_MONGODB_URI;

  if (process.env.NODE_ENV === "development") {
    if (!global._mongoClientPromise) {
      const client = new MongoClient(uri, options);
      global._mongoClientPromise = client.connect().catch((err) => {
        global._mongoClientPromise = undefined;
        throw err;
      });
    }
    return global._mongoClientPromise;
  } else {
    if (!clientPromise) {
      const client = new MongoClient(uri, options);
      clientPromise = client.connect().catch((err) => {
        clientPromise = null;
        throw err;
      });
    }
    return clientPromise;
  }
}

export default async function getClient() {
  return getMongoClient();
}

export async function getDatabase(dbName: string = "trendy_baba"): Promise<Db> {
  const clientInstance = await getMongoClient();
  return clientInstance.db(dbName);
}
