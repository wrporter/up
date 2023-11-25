import { render } from '@testing-library/react';
import React from 'react';
import { vi } from 'vitest';

import { mergeRefs } from './merge-refs';

it('mergesRefs uses all refs', () => {
    const Dummy = React.forwardRef(function Dummy(_, ref) {
        React.useImperativeHandle(ref, () => 'refValue');
        return null;
    });
    const refAsFunc = vi.fn();
    const refAsObj = { current: undefined };
    const nullRef = null;
    function Example({ visible }: { visible: boolean }) {
        return visible ? <Dummy ref={mergeRefs([refAsObj, refAsFunc, nullRef])} /> : null;
    }

    const { rerender } = render(<Example visible />);

    expect(refAsFunc).toHaveBeenCalledTimes(1);
    expect(refAsFunc).toHaveBeenCalledWith('refValue');
    expect(refAsObj.current).toBe('refValue');
    expect(nullRef).toBeNull();

    rerender(<Example visible={false} />);

    expect(refAsFunc).toHaveBeenCalledTimes(2);
    expect(refAsFunc).toHaveBeenCalledWith(null);
    expect(refAsObj.current).toBe(null);
    expect(nullRef).toBeNull();
});
