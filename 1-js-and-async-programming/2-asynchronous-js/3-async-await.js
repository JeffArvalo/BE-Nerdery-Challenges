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
  let allUsers = await getUsers();
  let likedMovies = await getLikedMovies();
  let dislikedMovies = await getDislikedMovies();

  let users = allUsers
    .map((user) => {
      let userLikeCount = likedMovies.find((review) => review.userId == user.id)
        .movies.length;
      let userDislikeCount = dislikedMovies.find(
        (review) => review.userId == user.id,
      ).movies.length;
      if (userDislikeCount > userLikeCount) return user;
    })
    .filter((user) => user !== undefined);

  let basicSubscriptionCount = 0;
  let premiumSubscriptionCount = 0;

  for (let i = 0; i < users.length; i++) {
    let user = users[i];
    let userSubscription = await getUserSubscriptionByUserId(user.id);
    userSubscription.subscription == "Basic"
      ? basicSubscriptionCount++
      : premiumSubscriptionCount++;
  }

  return basicSubscriptionCount > premiumSubscriptionCount
    ? "Basic"
    : "Premium";
};

getCommonDislikedSubscription().then((subscription) => {
  console.log("Common more dislike subscription is:", subscription);
});
