const express = require("express");
const cron = require("node-cron");
const cors = require("cors");
const { queries } = require("./graphqlClient");
const { ProfileStats } = require("./profileModel");

const app = express();

app.use(cors());
app.use(express.json());

function getProfiles() {
  return Promise.all(queries);
}

app.get("/profiles", async (req, res, next) => {
  let profiles = await getProfiles();

  let latestStats = await ProfileStats.find()
    .sort({ createdAt: -1 })
    .limit(profiles.length);

  profiles = profiles.map(({ profile }) => {
    const profileStats = latestStats.find(
      (stat) => stat.username === profile.username
    );
    profile.missedDaysCount = profileStats?.missedDaysCount | 0;
    return profile;
  });

  profiles.sort(
    (a, b) =>
      b.submitStats.submissionNum[0].count -
      a.submitStats.submissionNum[0].count
  );

  res.json(profiles);
});

cron.schedule("55 23 * * *", async function () {
  console.log("---------------------");
  console.log("Running Cron Job");
  const start = Date.now();
  const profiles = await getProfiles();
  const profilesPayload = await Promise.all(
    profiles.map(async ({ profile }) => {
      const username = profile.username;

      const todaysTotal = profile.submitStats.submissionNum[0].count;

      const payload = {
        username,
        total: todaysTotal,
      };

      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const ProfileStatsOfYesterday = await ProfileStats.findOne({
        username,
        createdAt: {
          $gte: new Date(new Date(yesterday).setHours(0, 0, 0)),
          $lt: new Date(new Date(yesterday).setHours(23, 59, 59)),
        },
      }).sort({ createdAt: -1 });

      if (ProfileStatsOfYesterday?.total !== undefined) {
        const todaysSolvedCount = todaysTotal - ProfileStatsOfYesterday.total;
        if (todaysSolvedCount < 1) {
          ProfileStatsOfYesterday.missedDaysCount++;
        }
        payload.missedDaysCount = ProfileStatsOfYesterday.missedDaysCount;
      }
      return payload;
    })
  );

  try {
    await ProfileStats.create(profilesPayload);
  } catch (err) {
    console.log(err);
  }

  console.log(
    `Cron job took ${(Date.now() - start) / 1000} seconds to complete`
  );
});

module.exports = app;
