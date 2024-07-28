import { format } from 'winston';

const { combine, timestamp, errors, json } = format;

// Pick specific fields from error objects. Some errors include more
// information than we should log. For example, Axios includes credentials sent
// with a request.
export const pickFieldsFromError = ({ name, message, stack }: Error) => ({
  name,
  message,
  stack,
});

export const transformErrors = (key: string, value: Error | any) => {
  // Some errors may not extend the Error class (such as Axios), but still
  // include the stack property
  if (value instanceof Error || value?.stack) {
    return pickFieldsFromError(value as Error);
  }
  return value;
};

export const prodFormat = combine(
  errors({ stack: true }),
  timestamp(),
  json({ replacer: transformErrors }),
);
