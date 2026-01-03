/**
 * Firestore-Based Token Generator
 * Generates sequential tokens (T001, T002, T003...) that reset daily
 * Uses Firestore transactions to ensure unique tokens across all devices
 */

import { db, isFirebaseConfigured } from './firebase';
import { doc, runTransaction } from 'firebase/firestore';

interface TokenCounter {
    date: string; // YYYY-MM-DD format
    counter: number;
}

/**
 * Get current date in YYYY-MM-DD format
 */
function getCurrentDate(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

/**
 * Generate next daily token using Firestore transaction
 * This ensures atomic increments across all devices
 * Resets to T001 every day at midnight
 */
export async function generateFirestoreToken(): Promise<string> {
    // Check if Firestore is configured
    if (!isFirebaseConfigured() || !db) {
        console.warn('⚠️ Firestore not configured - falling back to localStorage token generator');
        // Fallback to localStorage-based generator
        const { generateDailyToken } = await import('./tokenGenerator');
        return generateDailyToken();
    }

    try {
        const counterRef = doc(db, 'counters', 'dailyToken');
        const currentDate = getCurrentDate();

        // Use Firestore transaction for atomic counter increment
        const token = await runTransaction(db, async (transaction) => {
            const counterDoc = await transaction.get(counterRef);

            let counter = 1; // Default to 1 for new day or first order

            if (counterDoc.exists()) {
                const data = counterDoc.data() as TokenCounter;

                // Check if it's a new day - reset counter if so
                if (data.date === currentDate) {
                    counter = data.counter + 1;
                } else {
                    console.log(`📅 New day detected! Resetting token counter from ${data.date} to ${currentDate}`);
                    counter = 1;
                }
            } else {
                console.log('🆕 First token ever - initializing counter');
            }

            // Update counter in Firestore
            transaction.set(counterRef, {
                date: currentDate,
                counter: counter
            });

            // Format token with leading zeros (T001, T002, etc.)
            const tokenNumber = String(counter).padStart(3, '0');
            const formattedToken = `T${tokenNumber}`;

            console.log(`✅ Generated Firestore token: ${formattedToken} (counter: ${counter}, date: ${currentDate})`);

            return formattedToken;
        });

        return token;

    } catch (error) {
        console.error('❌ Firestore token generation failed:', error);
        console.warn('⚠️ Falling back to localStorage token generator');

        // Fallback to localStorage-based generator
        const { generateDailyToken } = await import('./tokenGenerator');
        return generateDailyToken();
    }
}

/**
 * Get current token count for today from Firestore
 */
export async function getFirestoreTodayTokenCount(): Promise<number> {
    if (!isFirebaseConfigured() || !db) {
        return 0;
    }

    try {
        const counterRef = doc(db, 'counters', 'dailyToken');
        const counterDoc = await runTransaction(db, async (transaction) => {
            return await transaction.get(counterRef);
        });

        if (counterDoc.exists()) {
            const data = counterDoc.data() as TokenCounter;
            const currentDate = getCurrentDate();

            // Only return count if it's for today
            if (data.date === currentDate) {
                return data.counter;
            }
        }

        return 0;
    } catch (error) {
        console.error('Error getting Firestore token count:', error);
        return 0;
    }
}

/**
 * Reset token counter in Firestore (for testing purposes)
 */
export async function resetFirestoreTokenCounter(): Promise<void> {
    if (!isFirebaseConfigured() || !db) {
        console.warn('Firestore not configured - cannot reset counter');
        return;
    }

    try {
        const counterRef = doc(db, 'counters', 'dailyToken');
        await runTransaction(db, async (transaction) => {
            transaction.delete(counterRef);
        });
        console.log('✅ Firestore token counter reset');
    } catch (error) {
        console.error('Error resetting Firestore token counter:', error);
    }
}
