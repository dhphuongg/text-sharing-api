const prisma = require('../prisma-client');

const getById = async (followById, followingId) => {
  const follow = await prisma.follow.findUnique({
    where: { followById_followingId: { followById, followingId } },
    include: {
      followBy: {
        select: { fullName: true, avatar: true, username: true, bio: true }
      },
      following: {
        select: { fullName: true, avatar: true, username: true, bio: true }
      }
    }
  });
  return follow;
};

const getFriendshipStatus = async (sourceUserId, targetUserId) => {
  let friendshipStatus = null;
  if (sourceUserId) {
    if (sourceUserId !== targetUserId) {
      friendshipStatus = {
        followBy: !!(await prisma.follow.findUnique({
          where: {
            followById_followingId: {
              followById: targetUserId,
              followingId: sourceUserId
            }
          }
        })),
        following: !!(await prisma.follow.findUnique({
          where: {
            followById_followingId: {
              followById: sourceUserId,
              followingId: targetUserId
            }
          }
        }))
      };
    }
  }
  return friendshipStatus;
};

const createById = async (followById, followingId) => {
  const follow = await prisma.follow.create({
    data: { followById, followingId },
    include: {
      followBy: {
        select: { fullName: true, avatar: true, username: true, bio: true }
      },
      following: {
        select: { fullName: true, avatar: true, username: true, bio: true }
      }
    }
  });
  return follow;
};

const deleteById = async (followById, followingId) => {
  const follow = await prisma.follow.delete({
    where: { followById_followingId: { followById, followingId } }
  });
  return follow;
};

const getFollowersById = async (id, { limit, page }) => {
  const [followers, total] = await prisma.$transaction([
    prisma.follow.findMany({
      where: { followingId: id },
      select: {
        followBy: {
          select: {
            id: true,
            username: true,
            fullName: true,
            avatar: true,
            _count: { select: { followers: true } }
          }
        }
      },
      take: limit,
      skip: (page - 1) * limit,
      orderBy: { createdAt: 'desc' }
    }),
    prisma.follow.count({ where: { followingId: id } })
  ]);
  return { users: followers.map((f) => f.followBy), total };
};

const getAllFollowersById = async (id) => {
  const followers = await prisma.follow.findMany({
    where: { followingId: id },
    select: {
      followBy: {
        select: {
          id: true,
          username: true,
          fullName: true,
          avatar: true,
          _count: { select: { followers: true } }
        }
      }
    }
  });
  return followers.map((f) => f.followBy);
};

const getFollowingById = async (id, { limit, page }) => {
  const [following, total] = await prisma.$transaction([
    prisma.follow.findMany({
      where: { followById: id },
      select: {
        following: {
          select: {
            id: true,
            username: true,
            fullName: true,
            avatar: true,
            _count: { select: { followers: true } }
          }
        }
      },
      take: limit,
      skip: (page - 1) * limit,
      orderBy: { createdAt: 'desc' }
    }),
    prisma.follow.count({ where: { followById: id } })
  ]);
  return { users: following.map((f) => f.following), total };
};

module.exports = {
  getById,
  getFriendshipStatus,
  createById,
  deleteById,
  getFollowersById,
  getAllFollowersById,
  getFollowingById
};
