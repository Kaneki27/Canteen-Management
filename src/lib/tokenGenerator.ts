/**
 * Token Generator for Daily-Reset Order Tokens
 * Generates sequential tokens (T001, T002, T003...) that reset daily
 */

const TOKEN_STORAGE_KEY = 'servesmart_token_counter';

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
 * Get token counter from localStorage
 */
function getTokenCounter(): TokenCounter {
    if (typeof window === 'undefined') {
        return { date: getCurrentDate(), counter: 0 };
    }

    try {
        const stored = localStorage.getItem(TOKEN_STORAGE_KEY);
        if (!stored) {
            return { date: getCurrentDate(), counter: 0 };
        }

        const counter: TokenCounter = JSON.parse(stored);
        const currentDate = getCurrentDate();

        // Reset counter if it's a new day
        if (counter.date !== currentDate) {
            return { date: currentDate, counter: 0 };
        }

        return counter;
    } catch (error) {
        console.error('Error reading token counter:', error);
        return { date: getCurrentDate(), counter: 0 };
    }
}

/**
 * Save token counter to localStorage
 */
function saveTokenCounter(counter: TokenCounter): void {
    if (typeof window === 'undefined') return;

    try {
        localStorage.setItem(TOKEN_STORAGE_KEY, JSON.stringify(counter));
    } catch (error) {
        console.error('Error saving token counter:', error);
    }
}

/**
 * Generate next daily token (T001, T002, T003...)
 * Resets to T001 every day at midnight
 */
export function generateDailyToken(): string {
    const counter = getTokenCounter();

    // Increment counter
    counter.counter += 1;

    // Save updated counter
    saveTokenCounter(counter);

    // Format token with leading zeros (T001, T002, etc.)
    const tokenNumber = String(counter.counter).padStart(3, '0');
    const token = `T${tokenNumber}`;

    console.log(`Generated token: ${token} for date: ${counter.date}`);

    return token;
}

/**
 * Get current token count for today
 */
export function getTodayTokenCount(): number {
    const counter = getTokenCounter();
    return counter.counter;
}

/**
 * Reset token counter (for testing purposes)
 */
export function resetTokenCounter(): void {
    if (typeof window === 'undefined') return;

    try {
        localStorage.removeItem(TOKEN_STORAGE_KEY);
        console.log('Token counter reset');
    } catch (error) {
        console.error('Error resetting token counter:', error);
    }
}
