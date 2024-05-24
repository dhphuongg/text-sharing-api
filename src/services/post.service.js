const prisma = require('../prisma-client');

const selectUserPreview = {
  id: true,
  avatar: true,
  fullName: true,
  username: true,
  bio: true,
  _count: { select: { followers: true } }
};

const selectPost = {
  id: true,
  createdAt: true,
  content: true,
  type: true,
  media: { select: { url: true, type: true }, orderBy: { id: 'asc' } },
  user: { select: selectUserPreview },
  _count: { select: { likers: true, replies: true } }
};

const selectPostWithPostRef = {
  ...selectPost,
  postRef: {
    select: selectPost
  }
};

const createPost = async (userId, content, type, postRefId) => {
  const post = await prisma.post.create({
    data: { userId, content, postRefId, type },
    include: { postRef: true }
  });
  return post;
};

const getById = async (id) => {
  const post = await prisma.post.findUnique({
    where: { id },
    select: selectPostWithPostRef
  });
  return post;
};

const getRepliesByPostId = async (id, { limit, page, sortBy }) => {
  const [replies, total] = await prisma.$transaction([
    prisma.post.findMany({
      where: { type: 'REPLY', postRefId: id },
      select: selectPost,
      take: limit,
      skip: (page - 1) * limit,
      orderBy: [{ likers: { _count: 'desc' } }, { [sortBy]: 'desc' }]
    }),
    prisma.post.count({ where: { type: 'REPLY', postRefId: id } })
  ]);
  return { replies, total };
};

const getNewByUsername = async (username, { limit, page }) => {
  const [posts, total] = await prisma.$transaction([
    prisma.post.findMany({
      where: { user: { username }, type: 'NEW' },
      select: selectPostWithPostRef,
      take: limit,
      skip: (page - 1) * limit,
      orderBy: { createdAt: 'desc' }
    }),
    prisma.post.count({ where: { user: { username }, type: 'NEW' } })
  ]);
  return { posts, total };
};

const editContentById = async (id, content) => {
  const post = await prisma.post.update({
    where: { id },
    data: { content },
    select: selectPostWithPostRef
  });
  return post;
};

const deleteById = async (id) => {
  const post = await prisma.post.delete({
    where: { id },
    include: { media: true }
  });
  return post;
};

const searchByContent = async ({ limit, page, keyword }) => {
  const [posts, total] = await prisma.$transaction([
    prisma.post.findMany({
      where: {
        OR: [{ content: { contains: keyword } }, { content: { search: keyword } }],
        type: 'NEW'
      },
      select: selectPostWithPostRef,
      take: limit,
      skip: (page - 1) * limit,
      orderBy: [{ likers: { _count: 'desc' } }, { createdAt: 'desc' }]
    }),
    prisma.post.count({
      where: {
        OR: [{ content: { contains: keyword } }, { content: { search: keyword } }],
        type: 'NEW'
      }
    })
  ]);
  return { posts, total };
};

const getLikeStatus = async (userId, postId) => {
  if (!userId) return false;
  const likeStatus = await prisma.post.findUnique({
    where: { id: postId, likers: { some: { userId } } }
  });
  return !!likeStatus;
};

module.exports = {
  createPost,
  getById,
  getRepliesByPostId,
  getNewByUsername,
  editContentById,
  deleteById,
  searchByContent,
  getLikeStatus
};
