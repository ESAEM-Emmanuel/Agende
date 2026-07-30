import cron from 'node-cron';
import { NotificationService } from '../modules/notifications/notification.service';
import { EmailService } from '../modules/notifications/email.service';
import { env } from '../config/env';

export function startAlertCron() {
  const notificationService = new NotificationService(new EmailService());
  const hoursBefore = parseInt(env.ALERT_HOURS_BEFORE);

  cron.schedule('0 * * * *', async () => {
    console.log(`⏰ [CRON] Vérification des rappels (${hoursBefore}h avant) pour admins & assistants...`);
    try {
      await notificationService.sendAdminAlerts(hoursBefore);
    } catch (err) {
      console.error('Erreur cron alertes:', err);
    }
  });

  console.log(`✅ Cron de rappels activé (toutes les heures, alerte ${hoursBefore}h avant → admins + assistants)`);
}