import admin from '#config/firebase';

class NotificationService {
  /**
   * Envía una notificación push a un token de usuario específico.
   * @param registrationToken El token FCM del dispositivo del usuario.
   * @param title El título de la notificación.
   * @param body El cuerpo del mensaje.
   */
  public async sendPushNotification(registrationToken: string, title: string, body: string): Promise<any> {
    const message = {
      notification: {
        title: title,
        body: body,
      },
      token: registrationToken,
    };

    try {
      const response = await admin.messaging().send(message);
      console.log('Notificación push enviada con éxito:', response);
      return response;
    } catch (error) {
      console.error('Error al enviar la notificación push:', error);
      throw error;
    }
  }
}

export default new NotificationService();