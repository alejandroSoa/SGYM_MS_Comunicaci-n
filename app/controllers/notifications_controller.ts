import type { HttpContext } from '@adonisjs/core/http';
import NotificationService from '#services/notification_service';
import MailService from '#services/mail_service';
import User from '#models/user';

export default class NotificationsController {

  /**
   * Envía una notificación push al usuario autenticado.
   */
  public async sendPush({ request, response, auth }: HttpContext) {
    const { title, body } = request.only(['title', 'body']);

    if (!title || !body) {
      return response.badRequest({
        status: 'error',
        data: {},
        msg: 'Faltan parámetros (title, body).'
      });
    }

    try {
      // Obtener el usuario autenticado
      const authenticatedUser = await auth.authenticate();
      
      // Buscar el usuario completo en la base de datos para obtener el token FCM
      const user = await User.find(authenticatedUser.id);
      
      if (!user) {
        return response.notFound({
          status: 'error',
          data: {},
          msg: 'Usuario no encontrado.'
        });
      }

      // Verificar que el usuario tenga un token FCM
      if (!user.fcm) {
        return response.badRequest({
          status: 'error',
          data: {},
          msg: 'El usuario no tiene un token FCM registrado. Primero debe registrar su token de dispositivo.'
        });
      }

      // Enviar la notificación push usando el token FCM del usuario
      const result = await NotificationService.sendPushNotification(user.fcm, title, body);
      
      return response.ok({
        status: 'success',
        data: {
          userId: user.id,
          messageId: result
        },
        msg: 'Notificación push enviada correctamente.'
      });
    } catch (error) {
      console.error('Error al enviar notificación push:', error);
      return response.internalServerError({
        status: 'error',
        data: {},
        msg: 'Error al enviar la notificación push.'
      });
    }
  }

  /**
   * Envía un correo electrónico al usuario autenticado.
   */
  public async sendEmail({ request, response, auth }: HttpContext) {
    const { subject, body } = request.only(['subject', 'body']);

    if (!subject || !body) {
      return response.badRequest({
        status: 'error',
        data: {},
        msg: 'Faltan parámetros (subject, body).'
      });
    }

    try {
      // Obtener el usuario autenticado
      const authenticatedUser = await auth.authenticate();
      
      // Buscar el usuario completo en la base de datos
      const user = await User.find(authenticatedUser.id);
      
      if (!user) {
        return response.notFound({
          status: 'error',
          data: {},
          msg: 'Usuario no encontrado.'
        });
      }

      // Enviar el correo electrónico usando el email del usuario autenticado
      await MailService.sendEmail(user.email, subject, body);
      
      return response.ok({
        status: 'success',
        data: {
          userId: user.id,
          email: user.email
        },
        msg: 'Correo electrónico enviado correctamente.'
      });
    } catch (error) {
      console.error('Error al enviar correo electrónico:', error);
      return response.internalServerError({
        status: 'error',
        data: {},
        msg: 'Error al enviar el correo electrónico.'
      });
    }
  }
}