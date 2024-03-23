function determineFriendshipStatus(source, target) {
  let friendshipStatus = null;
  if (source.id !== target.id) {
    friendshipStatus = {
      followedBy: source.followers.some((f) => f.followById === target.id),
      following: target.followers.some((f) => f.followById === source.id),
    };
  }
  return friendshipStatus;
}

module.exports = { determineFriendshipStatus };
