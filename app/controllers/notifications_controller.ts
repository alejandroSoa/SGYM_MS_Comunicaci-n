import type { HttpContext } from '@adonisjs/core/http';
import NotificationService from '#services/NotificationService';
import MailService from '#services/MailService';
import User from '#models/user';

export default class NotificationsController {

  /**
   * Envía una notificación push al usuario especificado.
   */
  public async sendPush({ request, response }: HttpContext) {
    const { user_id, title, body } = request.only(['user_id', 'title', 'body']);

    if (!user_id) {
      return response.badRequest({
        status: 'error',
        data: {},
        msg: 'El ID del usuario es requerido.'
      });
    }

    if (!title || !body) {
      return response.badRequest({
        status: 'error',
        data: {},
        msg: 'Faltan parámetros (title, body).'
      });
    }

    try {
      // Buscar el usuario en la base de datos usando el user_id proporcionado
      const user = await User.find(user_id);
      
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
    } catch (error: any) {
      console.error('Error al enviar notificación push:', error);
      
      // Manejo específico para errores de Firebase
      if (error.errorInfo?.code === 'messaging/mismatched-credential') {
        return response.badRequest({
          status: 'error',
          data: {
            error_code: 'mismatched_credential',
            firebase_project: 'proyecto9no-b0aa7'
          },
          msg: 'El token FCM no pertenece al proyecto Firebase correcto. Verifique que el cliente esté configurado para el proyecto "proyecto9no-b0aa7".'
        });
      }
      
      return response.internalServerError({
        status: 'error',
        data: {
          error_code: error.errorInfo?.code || 'unknown'
        },
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