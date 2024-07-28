import type { Counter, Histogram } from 'prom-client';
import promClient from 'prom-client';

/**
 * Options for configuring the dependency histogram.
 */
export interface DependencyHistogramOptions {
  /**
   * Custom histogram buckets. Defaults to `[0.003, 0.03, 0.1, 0.3, 0.6, 1,
   * 2.5, 5, 10, 30]`.
   */
  buckets?: number[];
}

export const defaultBuckets = [0.003, 0.03, 0.1, 0.3, 0.6, 1, 2.5, 5, 10, 30];

/**
 * Convenience service for custom metrics.
 */
class MetricsService {
  private _dependency?: Histogram<'dependency' | 'operation' | 'status'>;

  private _logCount?: Counter;

  /**
   * Dependency latency histogram for tracking latency of downstream
   * dependencies. Optionally also include the status of the operation as
   * `"pass"` or `"fail"`.
   */
  public get dependency(): Histogram<'dependency' | 'operation' | 'status'> {
    if (!this._dependency) {
      this._dependency = this.configureDependencyHistogram();
    }
    return this._dependency;
  }

  /**
   * Log counter to track log levels.
   */
  public get logCount(): Counter {
    if (!this._logCount) {
      this._logCount = new promClient.Counter({
        name: 'log_count',
        help: 'Log count per level.',
        labelNames: ['level'] as const,
      });
    }
    return this._logCount;
  }

  /**
   * Configure the dependency histogram if the default does not suit your
   * needs.
   * @param options - Options to configure the histogram.
   */
  configureDependencyHistogram(options: DependencyHistogramOptions = {}) {
    this._dependency = new promClient.Histogram({
      name: 'dependency_duration_seconds',
      help: 'Time elapsed for a dependency to perform an operation.',
      buckets: options.buckets ?? defaultBuckets,
      labelNames: ['dependency', 'operation', 'status'] as const,
    });
    return this._dependency;
  }
}

/**
 * Singleton metrics instance for reporting on custom, standardized metrics.
 */
export const metrics = new MetricsService();

/**
 * Decorator to time a function using dependency histogram metric.
 * @param dependency - The dependency to track.
 * @param operation - The operation to track.
 */
export function Time(dependency: string, operation: string) {
  return (target: unknown, name: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;

    descriptor.value = function timeFunction(...args: unknown[]) {
      return time(dependency, operation, () => originalMethod.apply(this, args));
    };
  };
}

/**
 * Function form of the @Time decorator.
 */
export function time(dependency: string, operation: string, func: Function) {
  const endTimer = metrics.dependency.startTimer({
    dependency,
    operation,
  });

  try {
    const result = func();

    // Support async operations
    if (result?.then) {
      return result
        .then((value: any) => {
          endTimer({ status: 'pass' });
          return value;
        })
        .catch((error: Error) => {
          endTimer({ status: 'fail' });
          throw error;
        });
    }

    endTimer({ status: 'pass' });
    return result;
  } catch (error) {
    endTimer({ status: 'fail' });
    throw error;
  }
}
