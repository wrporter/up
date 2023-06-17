import { hello } from './hello';

describe('hello', () => {
    it('greets the provided entity', () => {
        const actual = hello('World');
        expect(actual).toEqual('Hello, World!');
    });
});
