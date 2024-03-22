const prisma = require("../prisma-client");

const getById = async (followById, followingId) => {
  const follow = await prisma.follow.findUnique({
    where: { followById_followingId: { followById, followingId } },
    include: {
      followBy: {
        select: { fullName: true, avatar: true, username: true, bio: true },
      },
      following: {
        select: { fullName: true, avatar: true, username: true, bio: true },
      },
    },
  });
  return follow;
};

const createById = async (followById, followingId) => {
  const follow = await prisma.follow.create({
    data: { followById, followingId },
    include: {
      followBy: {
        select: { fullName: true, avatar: true, username: true, bio: true },
      },
      following: {
        select: { fullName: true, avatar: true, username: true, bio: true },
      },
    },
  });
  return follow;
};

const deleteById = async (followById, followingId) => {
  const follow = await prisma.follow.delete({
    where: { followById_followingId: { followById, followingId } },
  });
  return follow;
};

module.exports = { getById, createById, deleteById };
