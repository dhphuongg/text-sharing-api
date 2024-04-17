const prisma = require('../prisma-client');

const create = async (userId, postId) => {
  const reaction = await prisma.reation.create({
    data: { userId, postId },
    select: {
      createdAt: true,
      post: true,
      userId: true
    }
  });
  return reaction;
};

const deleteById = async (userId, postId) => {
  const reaction = await prisma.reation.delete({
    where: { postId_userId: { postId, userId } }
  });
  return reaction;
};

const getPostsByLikerId = async (userId, { limit, page }) => {
  const [reactions, total] = await prisma.$transaction([
    prisma.reation.findMany({
      where: { userId },
      select: {
        post: {
          select: {
            id: true,
            createdAt: true,
            content: true,
            type: true,
            media: { select: { url: true, type: true }, orderBy: { id: 'asc' } },
            user: {
              select: {
                id: true,
                avatar: true,
                fullName: true,
                username: true,
                _count: { select: { followers: true } }
              }
            },
            postRef: {
              select: {
                id: true,
                createdAt: true,
                content: true,
                type: true,
                media: {
                  select: { url: true, type: true },
                  orderBy: { id: 'asc' }
                },
                user: {
                  select: {
                    id: true,
                    avatar: true,
                    fullName: true,
                    username: true,
                    _count: { select: { followers: true } }
                  }
                },
                _count: { select: { likers: true, replies: true } }
              }
            },
            _count: { select: { likers: true, replies: true } }
          }
        }
      },
      take: limit,
      skip: (page - 1) * limit,
      orderBy: { createdAt: 'desc' }
    }),
    prisma.reation.count({ where: { userId } })
  ]);
  return { posts: reactions.map((r) => r.post), total };
};

const getLikersByPostId = async (postId, { limit, page }) => {
  const [reactions, total] = await prisma.$transaction([
    prisma.reation.findMany({
      where: { postId },
      select: {
        user: {
          select: {
            id: true,
            avatar: true,
            fullName: true,
            username: true,
            _count: { select: { followers: true } }
          }
        }
      },
      take: limit,
      skip: (page - 1) * limit,
      orderBy: { createdAt: 'desc' }
    }),
    prisma.reation.count({ where: { postId } })
  ]);
  return { users: reactions.map((r) => r.user), total };
};

module.exports = { create, deleteById, getPostsByLikerId, getLikersByPostId };
