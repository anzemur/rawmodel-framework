import { Spec } from '@hayspec/spec';
import { Model, prop } from '../../..';

const spec = new Spec();

spec.test('handles property errors', async (ctx) => {
  const handle = [{
    resolver: (e) => e.message === 'foo',
    code: 100,
  }];
  class Book extends Model {
    @prop({
      handle
    })
    title: string;
  }
  class Country extends Model {
    @prop()
    code: string;
  }
  class User extends Model {
    @prop({
      handle
    })
    name: string;
    @prop({
      handle,
      parse: { resolver: Book },
    })
    book0: Book;
    @prop({
      handle,
      parse: { array: true, resolver: Book },
    })
    books0: Book[];
    @prop({
      parse: { resolver: Book },
    })
    book1: Book;
    @prop({
      parse: { array: true, resolver: Book },
    })
    books1: Book[];
    @prop({
      parse: { resolver: Country },
    })
    country: Country;
  }
  const user = new User({
    book1: {},
    books1: [{}],
    country: {},
  });
  const problem0 = new Error();
  const problem1 = new Error('foo');
  const errors = [100];
  await user.handle(problem0);
  ctx.true(user.isValid());
  await user.handle(problem1);
  ctx.false(user.isValid());
  ctx.throws(() => user.handle(problem0, { quiet: false }));
  ctx.throws(() => user.handle(problem1, { quiet: false }));
  ctx.deepEqual(user.collectErrors(), [
    { path: ['name'], errors },
    { path: ['book0'], errors },
    { path: ['books0'], errors },
    { path: ['book1', 'title'], errors },
    { path: ['books1', 0, 'title'], errors },
  ]);
});

export default spec;
