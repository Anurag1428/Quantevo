/**
 * Retry utility with exponential backoff
 * Handles transient errors and network failures
 */

export interface RetryOptions {
  maxRetries?: number;
  baseDelay?: number;
  maxDelay?: number;
  backoffMultiplier?: number;
  onRetry?: (attempt: number, error: Error) => void;
}

const DEFAULT_OPTIONS: Required<RetryOptions> = {
  maxRetries: 3,
  baseDelay: 1000, // 1 second
  maxDelay: 30000, // 30 seconds
  backoffMultiplier: 2,
  onRetry: () => {},
};

/**
 * Executes a function with automatic retry logic using exponential backoff
 * 
 * @param fn - Async function to retry
 * @param options - Retry configuration options
 * @returns Promise with result from function
 * @throws Error if all retry attempts fail
 * 
 * @example
 * const data = await withRetry(() => scrapeStockPrice('AAPL'), {
 *   maxRetries: 5,
 *   baseDelay: 2000
 * });
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const config = { ...DEFAULT_OPTIONS, ...options };
  
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < config.maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      
      // Don't retry if this is the last attempt
      if (attempt === config.maxRetries - 1) {
        break;
      }

      // Calculate delay with exponential backoff
      const delay = Math.min(
        config.baseDelay * Math.pow(config.backoffMultiplier, attempt),
        config.maxDelay
      );

      // Add jitter to prevent thundering herd
      const jitter = Math.random() * 0.1 * delay;
      const totalDelay = delay + jitter;

      console.log(
        `Retry attempt ${attempt + 1}/${config.maxRetries} after ${totalDelay.toFixed(0)}ms. ` +
        `Error: ${lastError.message}`
      );

      // Call the retry callback
      config.onRetry(attempt + 1, lastError);

      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, totalDelay));
    }
  }

  throw new Error(
    `Failed after ${config.maxRetries} attempts. Last error: ${lastError?.message}`
  );
}

/**
 * Executes a function with a timeout
 * 
 * @param fn - Async function to execute
 * @param timeoutMs - Timeout in milliseconds
 * @returns Promise with function result
 * @throws Error if timeout is exceeded
 */
export async function withTimeout<T>(
  fn: () => Promise<T>,
  timeoutMs: number
): Promise<T> {
  return Promise.race([
    fn(),
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(`Operation timed out after ${timeoutMs}ms`)), timeoutMs)
    ),
  ]);
}

/**
 * Executes a function with retry and timeout
 * 
 * @param fn - Async function to execute
 * @param retryOptions - Retry configuration
 * @param timeoutMs - Timeout per attempt
 * @returns Promise with function result
 */
export async function withRetryAndTimeout<T>(
  fn: () => Promise<T>,
  retryOptions: RetryOptions = {},
  timeoutMs: number = 10000
): Promise<T> {
  return withRetry(
    () => withTimeout(fn, timeoutMs),
    retryOptions
  );
}

/**
 * Delays execution for specified milliseconds
 * 
 * @param ms - Milliseconds to delay
 * @returns Promise that resolves after delay
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Retries a function with linear backoff
 * 
 * @param fn - Async function to retry
 * @param maxRetries - Maximum number of retry attempts
 * @param delayMs - Linear delay in milliseconds
 * @returns Promise with function result
 */
export async function withLinearRetry<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  delayMs: number = 1000
): Promise<T> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      
      if (attempt < maxRetries - 1) {
        await delay(delayMs);
      }
    }
  }

  throw lastError || new Error('Operation failed');
}
