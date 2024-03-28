const messageConstant = require('../constants/message.constant');
const validationConstant = require('../constants/validation.constant');
const prisma = require('../prisma-client');

const createNotification = async (
  actorId,
  receiverId,
  event = validationConstant.event.follow,
  postId = null
) => {
  const notification = await prisma.notification.create({
    data: {
      actorId,
      receiverId,
      postId,
      event,
      content: messageConstant.notifyContent[event]
    }
  });
  return notification;
};

const getNotificationsByReceiver = async (receiverId, { limit, page }) => {
  const [notifications, total] = await prisma.$transaction([
    prisma.notification.findMany({
      where: { receiverId },
      select: {
        id: true,
        createdAt: true,
        event: true,
        content: true,
        actor: {
          select: {
            id: true,
            fullName: true,
            username: true,
            avatar: true,
            _count: { select: { followers: true } }
          }
        },
        post: { select: { id: true, content: true } }
      },
      take: limit,
      skip: (page - 1) * limit,
      orderBy: { createdAt: 'desc' }
    }),
    prisma.notification.count({ where: { receiverId } })
  ]);
  return { notifications, total };
};

module.exports = { createNotification, getNotificationsByReceiver };
