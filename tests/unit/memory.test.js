const {
  writeFragment,
  readFragment,
  writeFragmentData,
  readFragmentData,
  listFragments,
} = require('../../src/model/data/memory/index.js');

describe('Fragment Test', () => {
  test('writeFragment(fragment) returns nothing', async () => {
    const fragment = { ownerId: 'ownerTestId', id: 'testId', fragment: 'test fragment' };

    const result = await writeFragment(fragment);
    expect(result).toBe(undefined);
  });

  test('readFragment(ownerId, id) returns what we write into db', async () => {
    const fragment = { ownerId: 'ownerTestId', id: 'testId', fragment: 'test fragment' };

    await writeFragment(fragment);
    const result = await readFragment(fragment.ownerId, fragment.id);
    expect(result).toBe(fragment);
  });

  test('readFragment(ownerId, id) returns nothing with incorrect id', async () => {
    const fragment = { ownerId: 'ownerTestId', id: 'testId', fragment: 'test fragment' };
    await writeFragment(fragment);
    const result = await readFragment(fragment.ownerId, 'IncorrectId');
    expect(result).toBe(undefined);
  });

  test('writeFragmentData(ownerId, id, value) returns nothing', async () => {
    const ownerId = 'testOwnerId';
    const id = 'testId';
    const value = 'test fragment';

    const result = await writeFragmentData(ownerId, id, value);
    expect(result).toBe(undefined);
  });

  test('readFragmentData(ownerId, id) returns the value for the given user', async () => {
    const ownerId = 'testOwnerId';
    const id = 'testId';
    const value = 'test fragment';

    await writeFragmentData(ownerId, id, value);
    const result = await readFragmentData(ownerId, id);
    expect(result).toBe('test fragment');
  });

  test('listFragments(ownerId, expand) returns a list of fragment ids for the given user', async () => {
    await writeFragment({ ownerId: 'owner1', id: '1', fragment: 'test fragment 1' });
    await writeFragmentData('owner1', '1', 'This is test fragment 1.');

    await writeFragment({ ownerId: 'owner1', id: '2', fragment: 'test fragment 2' });
    await writeFragmentData('owner1', '2', 'This is test fragment 2.');

    await writeFragment({ ownerId: 'owner1', id: '3', fragment: 'test fragment 3' });
    await writeFragmentData('owner1', '3', 'This is test fragment 3.');

    // expand = false
    const ids = await listFragments('owner1');
    expect(Array.isArray(ids)).toBe(true);
    expect(ids).toEqual(['1', '2', '3']);

    // expand = true
    const fragments = await listFragments('owner1', true);
    expect(Array.isArray(fragments)).toBe(true);
    expect(fragments).toEqual([
      { ownerId: 'owner1', id: '1', fragment: 'test fragment 1' },
      { ownerId: 'owner1', id: '2', fragment: 'test fragment 2' },
      { ownerId: 'owner1', id: '3', fragment: 'test fragment 3' },
    ]);
  });
});
