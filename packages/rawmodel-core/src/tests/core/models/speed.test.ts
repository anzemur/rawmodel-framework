import { Spec } from '@hayspec/spec';
import { floatParser, stringParser } from '@rawmodel/parsers';
import { Model, prop } from '../../..';

const spec = new Spec();

spec.test('creation of ~5k models', (ctx) => {
  class Author extends Model {
    @prop({
      parse: { resolver: floatParser() },
      serializable: ['output'],
    })
    id: number;
    @prop({
      parse: { resolver: stringParser() },
      serializable: ['output'],
    })
    name: string;
    @prop({
      parse: { resolver: stringParser() },
      populatable: ['input'],
    })
    email: string;
  }
  class Book extends Model {
    @prop({
      parse: { resolver: floatParser() },
      serializable: ['output'],
    })
    id: number;
    @prop({
      parse: { resolver: stringParser() },
    })
    title: string;
    @prop({
      parse: { resolver: stringParser() },
      populatable: ['input'],
    })
    description: string;
    @prop({
      parse: { array: true, resolver: Author },
      populatable: ['input'],
    })
    author: Author[];
  }
  class User extends Model {
    @prop({
      parse: { resolver: floatParser() },
      serializable: ['output'],
    })
    id: number;
    @prop({
      parse: { resolver: stringParser() },
      serializable: ['output'],
    })
    name: string;
    @prop({
      parse: { resolver: stringParser() },
      populatable: ['input'],
    })
    email: string;
    @prop({
      parse: { resolver: Book },
    })
    book0: Book;
    @prop({
      parse: { resolver: Book },
    })
    book1: Book;
    @prop({
      parse: { array: true, resolver: Book },
      populatable: ['input'],
    })
    books: Book[];
  }
  const sampleBooks = Array(500).fill(null).map(() => ({
    id: 300,
    title: 'Baz',
    description: 'Zed',
    author: [
      { id: 100, name: 'John', email: 'foo@bar.com' },
      { id: 100, name: 'John', email: 'foo@bar.com' },
      { id: 100, name: 'John', email: 'foo@bar.com' },
      { id: 100, name: 'John', email: 'foo@bar.com' },
      { id: 100, name: 'John', email: 'foo@bar.com' },
    ],
  }));
  const sampleUsers = Array(100).fill(null).map(() => ({
    id: 100,
    name: 'John',
    email: 'foo@bar.com',
    book0: sampleBooks[0],
    book1: sampleBooks[1],
    books: [...sampleBooks],
  }));
  const users = sampleUsers.map((data) => new User(data));
  ctx.is(users.length, 100);
});

export default spec;
