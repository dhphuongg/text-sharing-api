const prisma = require('../prisma-client');
const LocaleKey = require('../locales/key.locale');
const locale = require('../locales/locale');
const { constants } = require('../constants');

const createNotification = async (
  actorId,
  receiverId,
  event = constants.event.follow,
  postId = null
) => {
  const notification = await prisma.notification.create({
    data: {
      actorId,
      receiverId,
      postId,
      event,
      content: _t({ phrase: LocaleKey[`NOTIFICATION_${event}`], locale: locale.en })
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
