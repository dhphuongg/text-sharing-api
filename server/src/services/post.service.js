const prisma = require("../prisma-client");

const createNewPost = async (userId, content, type, postRefId) => {
  const post = await prisma.post.create({
    data: { userId, content, postRefId, type },
  });
  return post;
};

const getById = async (id) => {
  const post = await prisma.post.findUnique({
    where: { id },
    select: {
      id: true,
      createdAt: true,
      content: true,
      type: true,
      media: {
        select: { id: true, createdAt: true, mediaFileUrl: true },
        orderBy: { createdAt: "desc" },
      },
      user: {
        select: {
          id: true,
          avatar: true,
          fullName: true,
          username: true,
        },
      },
      postRef: {
        select: {
          id: true,
          createdAt: true,
          content: true,
          type: true,
          media: {
            select: { id: true, mediaFileUrl: true },
          },
          user: {
            select: {
              id: true,
              avatar: true,
              fullName: true,
              username: true,
            },
          },
          _count: { select: { likers: true, replies: true } },
        },
      },
      _count: {
        select: { replies: true, likers: true },
      },
    },
  });
  return post;
};

const getRepliesById = async (id, { limit, page, sortBy }) => {
  const [replies, total] = await prisma.$transaction([
    prisma.post.findUnique({
      where: { id },
      select: {
        replies: {
          select: {
            id: true,
            createdAt: true,
            content: true,
            media: { select: { id: true, mediaFileUrl: true } },
            user: {
              select: {
                id: true,
                avatar: true,
                fullName: true,
                username: true,
              },
            },
            _count: { select: { likers: true, replies: true } },
          },
          take: limit,
          skip: (page - 1) * limit,
          orderBy: [{ likers: { _count: "desc" } }, { [sortBy]: "desc" }],
        },
      },
    }),
    prisma.post.findUnique({
      where: { id },
      select: {
        _count: {
          select: {
            replies: true,
          },
        },
      },
    }),
  ]);
  return { replies: replies.replies, total: total._count.replies };
};

const editContentById = async (id, content) => {
  const post = await prisma.post.update({
    where: { id },
    data: { content },
    select: {
      id: true,
      createdAt: true,
      content: true,
      type: true,
      media: {
        select: { id: true, createdAt: true, mediaFileUrl: true },
        orderBy: { createdAt: "desc" },
      },
      user: {
        select: {
          id: true,
          avatar: true,
          fullName: true,
          username: true,
        },
      },
      likers: { select: { userId: true } },
      replies: { select: { id: true } },
      postRef: {
        select: {
          id: true,
          createdAt: true,
          content: true,
          type: true,
          media: {
            select: { id: true, mediaFileUrl: true },
          },
          user: {
            select: {
              id: true,
              avatar: true,
              fullName: true,
              username: true,
            },
          },
        },
      },
    },
  });
  return post;
};

const deleteById = async (id) => {
  const post = await prisma.post.delete({
    where: { id },
    include: { media: true },
  });
  return post;
};

module.exports = {
  createNewPost,
  getById,
  getRepliesById,
  editContentById,
  deleteById,
};
