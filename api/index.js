import express from 'express';
import { apolloServer } from 'apollo-server';

import { schema, resolvers } from './schema';

import { GitHubConnector } from './github/connector';
import { Repositories } from './github/models';
import { Entries } from './sql/models';

const PORT = 3010;

const app = express();

app.use('/graphql', apolloServer(() => {
  const gitHubConnector = new GitHubConnector({
    client_id: process.env.GITHUB_CLIENT_ID,
    client_secret: process.env.GITHUB_CLIENT_SECRET,
  });

  return {
    graphiql: true,
    pretty: true,
    resolvers,
    schema,
    context: {
      Repositories: new Repositories({ connector: gitHubConnector }),
      Entries: new Entries({ connector: gitHubConnector }),
    }
  };
}));

app.listen(PORT, () => console.log(
  `Server is now running on http://localhost:${PORT}`
));