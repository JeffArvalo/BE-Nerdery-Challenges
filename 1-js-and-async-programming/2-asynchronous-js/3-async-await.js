/*

  Challenge 3: Most Common Subscription for Harsh Reviewers

  Find the most common subscription among users who dislike more movies than they like.
  Use the methods in utils/mocked-api to get user and rating data.
  Check each user's likes vs. dislikes, filter those with more dislikes, and return the most frequent subscription.

  Requesites:
    - Use await with the methods from utils/mocked-api to get the data
    - Make sure to return a string containing the name of the most common subscription
*/

/**
 * Logs the most common subscription among users
 * who disliked more movies than they liked.
 *
 * @returns {Promise<string>} Logs the subscription name as a string.
 */

const {
  getLikedMovies,
  getDislikedMovies,
  getUsers,
  getUserSubscriptionByUserId,
} = require("./utils/mocked-api");

const getCommonDislikedSubscription = async () => {
  // Add your code here
  const allUsers = await getUsers();
  const likedMovies = await getLikedMovies();
  const dislikedmovies = await getDislikedMovies();

  const userLikeCount = new Map();
  likedMovies.map((review) => {
    userLikeCount.set(review.userId, review.movies.length);
  });

  const userDislikeCount = new Map();
  dislikedmovies.map((review) => {
    userDislikeCount.set(review.userId, review.movies.length);
  });

  const users = allUsers
    .map((user) => {
      if (userDislikeCount.get(user.id) > userLikeCount.get(user.id))
        return user;
    })
    .filter((user) => user !== undefined);

  const subscriptionsCount = new Map();
  await users.map(async (user) => {
    const subscription = await getUserSubscriptionByUserId(user.id);
    const subscriptionName = subscription.subscription;

    if (subscriptionsCount.has(subscriptionName)) {
      subscriptionsCount.set(
        subscriptionName,
        subscriptionsCount.get(subscriptionName) + 1,
      );
    } else {
      subscriptionsCount.set(subscriptionName, 1);
    }
  });

  let commonSubsciption = "";
  let maxCount = 0;

  subscriptionsCount.forEach((value, key) => {
    if (value > maxCount) {
      maxCount = value;
      commonSubsciption = key;
    }
  });

  return commonSubsciption;
};

getCommonDislikedSubscription().then((subscription) => {
  console.log("Common more dislike subscription is:", subscription);
});
