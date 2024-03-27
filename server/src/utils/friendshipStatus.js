const { followService } = require("../services");

async function addFriendshipStatusForPostAuthor(reqAuthId, post) {
  post.user.friendshipStatus = await followService.getFriendshipStatus(
    reqAuthId,
    post.user.id
  );
  if (post.postRef) {
    post.postRef.user.friendshipStatus =
      await followService.getFriendshipStatus(reqAuthId, post.postRef.user.id);
  }
  return post;
}

module.exports = { addFriendshipStatusForPostAuthor };
