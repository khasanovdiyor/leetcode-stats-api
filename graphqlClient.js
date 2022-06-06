const { GraphQLClient, gql } = require("graphql-request");
const dotenv = require("dotenv");

dotenv.config();

const USERNAMES = process.env.LEETCODE_USERNAMES.split(", ");

const client = new GraphQLClient("https://leetcode.com/graphql");

const query = gql`
  query userProblemsSolved($username: String!) {
    profile: matchedUser(username: $username) {
      username
      submitStats: submitStatsGlobal {
        submissionNum: acSubmissionNum {
          difficulty
          count
        }
      }
    }
  }
`;

const queries = USERNAMES.map((username) =>
  client.request(query, { username })
);

module.exports = { queries };
