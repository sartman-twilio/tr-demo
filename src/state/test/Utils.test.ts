import {compute} from '../../helper/Utils'


it('adds if absent', () => {
  let map = new Map<string, number>([['a', 1], ['b', 2]])
  compute(map, 'c', (k, v) => !!v ? v + 3 : 3)
  expect(map).toEqual(new Map<string, number>([['a', 1], ['b', 2], ['c', 3]]))
})

it('modifies if present', () => {
  let map = new Map<string, number>([['a', 1], ['b', 2], ['c', 3]])
  compute(map, 'c', (k, v) => !!v ? v + 3 : 3)
  expect(map).toEqual(new Map<string, number>([['a', 1], ['b', 2], ['c', 6]]))
})
