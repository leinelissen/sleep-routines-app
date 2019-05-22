import { Notifications } from 'expo';
import { setDayOfYear, getDayOfYear, subMinutes, addDays, isFuture } from 'date-fns';

// We need to set all notifications in advance. Since they are currently only
// set when someone changes the time, we need to determine for how many days we
// need to plan notifications ahead. 
const AMOUNT_OF_NOTIFICATIONS_PLANNED = 15;

/**
 * Whenever the sleepTime changes, we need to scrap all previous notifications,
 * and set new ones. 
 *
 * @param {*} sleepTime
 * @returns Promise
 */
function scheduleNotifications(routineStartTime) {
    // Calculate notification time
    var actualisedRoutineStartTime = setDayOfYear(routineStartTime, getDayOfYear(new Date()));

    // Check if the notification time is in the future, if not add a day
    if (!isFuture(actualisedRoutineStartTime)) {
        actualisedRoutineStartTime = addDays(actualisedRoutineStartTime, 1);
    }

    // Cancel any scheduled notifications
    return Notifications.cancelAllScheduledNotificationsAsync()
        // Create an array with notifications for the coming days
        .then(() => {
            // The first prompt tells users to relax
            const preSleepTime = subMinutes(actualisedRoutineStartTime, 90);
            const preSleepNotifications = [...new Array(AMOUNT_OF_NOTIFICATIONS_PLANNED)]
                .map((x, i) => ({
                    time: addDays(preSleepTime, i),
                    text: `Take your time to relax ☕️. Your bedtime routine starts in 90 minutes...`
                }));

            // The second prompt asks them to start their routines
            const routineTime = subMinutes(actualisedRoutineStartTime, 30);
            const routineNotifcations = [...new Array(AMOUNT_OF_NOTIFICATIONS_PLANNED)]
                .map((x, i) => ({
                    time: addDays(routineTime, i),
                    text: `It's time for bed 🛌. Start your routine in the next 30 minutes...`
                }));
    
            // Merge the two arrays of notifications
            return [
                ...preSleepNotifications,
                ...routineNotifcations,
            ];
        })
        // Schedule all notifications
        .then(notifications => Promise.all(
            // Loop through all notifications given
            notifications.map(({ text, time }) => {
                // Schedule a single notification
                return Notifications.scheduleLocalNotificationAsync({
                    // Notification heading
                    title: 'Sleep Routines',
                    // Notification text
                    body: text,
                    ios: {
                        sound: true,
                    }
                }, { time })
            })
        ));
}

export default scheduleNotifications;