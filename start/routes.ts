/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'
const UsersController = () => import('#controllers/users_controller')
const OauthController = () => import('#controllers/OAuth/auth_controller')
const NotificationsController = () => import('#controllers/notifications_controller')

// Ruta para actualizar token FCM
router.put('/users/fcm-token', [UsersController, 'updateFcmToken']).use(middleware.auth())

// Rutas de notificaciones - usando el usuario autenticado
router.post('/notifications/push', [NotificationsController, 'sendPush']).use(middleware.auth())
router.post('/notifications/email', [NotificationsController, 'sendEmail']).use(middleware.auth())
