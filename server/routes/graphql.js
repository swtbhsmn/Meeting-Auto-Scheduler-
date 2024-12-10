const fs = require("fs");
const { createHandler } = require("graphql-http/lib/use/express");
const { buildSchema } = require("graphql");

const schema = buildSchema(fs.readFileSync('schema.graphql', "utf8"));
const users = require("../resolvers/users");
const authentication = require("../resolvers/authentication");
const selection = require("../resolvers/selection");
const stats = require("../resolvers/stats");
const meeting = require("../resolvers/meeting");
const investor = require("../resolvers/investor");
const portfolio = require("../resolvers/portfolio");

const resolvers = {
    ...users.query,
    ...users.mutation,
    ...authentication.query,
    ...authentication.mutation,
    ...selection.query,
    ...stats.query,
    ...meeting.query,
    ...investor.query,
    ...portfolio.query
}
module.exports = createHandler({ schema, rootValue: resolvers });
