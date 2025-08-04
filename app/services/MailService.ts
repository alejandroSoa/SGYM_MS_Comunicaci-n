import Mail from '@adonisjs/mail/services/main';

class MailService {
  /**
   * Envía un correo electrónico.
   * @param to La dirección de correo del destinatario.
   * @param subject El asunto del correo.
   * @param body El contenido del cuerpo del correo (puede ser HTML).
   */
  public async sendEmail(to: string, subject: string, body: string): Promise<void> {
    try {
      await Mail.send((message) => {
        message
          .to(to)
          .from('tu-email@ejemplo.com') // Reemplaza con tu correo
          .subject(subject)
          .html(body);
      });
      console.log('Correo electrónico enviado con éxito a:', to);
    } catch (error) {
      console.error('Error al enviar el correo electrónico:', error);
      throw error;
    }
  }
}

export default new MailService();