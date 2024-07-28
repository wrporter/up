import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { vi } from 'vitest';

import { mergeHandlers } from './merge-handlers.js';

it('mergesHandlers calls all handlers', () => {
  const clickHandler1 = vi.fn();
  const clickHandler2 = vi.fn();
  render(
    <button type="button" onClick={mergeHandlers(clickHandler1, clickHandler2)}>
      Click
    </button>,
  );

  fireEvent.click(screen.getByRole('button'));

  expect(clickHandler1).toHaveBeenCalledTimes(1);
  expect(clickHandler2).toHaveBeenCalledTimes(1);
  expect(clickHandler1).toHaveBeenCalledWith(expect.anything());
  expect(clickHandler2).toHaveBeenCalledWith(expect.anything());
});
