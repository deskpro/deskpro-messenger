import cache from '../Cache';

describe('Cache wrapper class', () => {
  it('should correctly read/update values', () => {
    cache.setValue('some.long.path', 'some value');
    expect(cache.getValue('some').long.path).toBe('some value');
    expect(cache.getValue('some.long').path).toBe('some value');
    expect(cache.getValue('some.long.path')).toBe('some value');

    cache.setValue('some.arr.0.key', '123sad');
    expect(cache.getValue('some.arr')).toBeArrayOfSize(1);
    expect(cache.getValue('some.arr')[0].key).toBe('123sad');

    cache.setValue(['some.arr', ['key', '123sad'], 'name'], 'name property');
    expect(cache.getValue('some.arr.0')).toEqual({
      key: '123sad',
      name: 'name property'
    });

    cache.mergeArray(
      'some.arr',
      [
        { key: '123sad', value: 'some new value' },
        { key: '432d2a', value: 'another value' }
      ],
      'key'
    );
    expect(cache.getValue('some.arr')).toBeArrayOfSize(2);
    expect(cache.getValue('some.arr.0')).toEqual({
      key: '123sad',
      name: 'name property',
      value: 'some new value'
    });
    expect(cache.getValue('some.arr.1.value')).toBe('another value');
    expect(cache.getValue(['some.arr', ['key', '432d2a'], 'value'])).toBe(
      'another value'
    );
  });
});
