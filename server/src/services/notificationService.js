/**
 * Notification service for dispatching internal / event notifications
 */
export const sendNotification = async ({ recipientId, title, message, type = 'INFO', link = '' }) => {
  console.log(`[Notification] To User(${recipientId}) [${type}]: ${title} - ${message} (Link: ${link})`);
  return {
    success: true,
    dispatchedAt: new Date(),
    recipientId,
    title,
  };
};
