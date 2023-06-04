# Directus SDK

This repository can be seen as an alternative proposal to the current [Directus SDK](https://github.com/directus/sdk). In the following I share my thoughts about it and explain how my SDK works.

> Note: I wrote all the code for this library within 3 days. Even though I have already written tests for the most important actions and the SDK is basically working, it should currently be considered experimental.

## Design decisions

In developing this SDK, I made a few fundamentally different choices as opposed to official SDK and would like to explain them in more detail below.

### Modular design

Similar to the Firebase Web SDK or my form library [Modular Forms](https://modularforms.dev/), I have developed this SDK modular. This has the advantage that the user only has to import the code he actually needs. This leads to a smaller bundle size and to performance advantages when the SDK is executed client-side, because the browser only has to download and parse the code that is really needed. Through code splitting of modern frameworks, the bundle size can be reduced to a minimum.

The current bundle size of this SDK is 6 KB (1.7 KB minified and gziped). If only the public client with the `readItem` and `readItems` function is used to display content of the CMS in a website, the bundle size is reduced to
2 KB (1 KB minified and gziped).

A modular design has the advantage to extend the functionality by additional functions (e.g. real-time updates with sockets) without increasing the bundle size for everyone. Also we could offer adapters for the different frameworks, so that the effort on the part of the developers is reduced to a minimum.

### TypeScript first

The current SDK has several problems when using TypeScript. First, it is not completely type-safe, which means that some errors can only be discovered at runtime. Also, this significantly reduces DX since typecasting or other tricks have to be applied and auto-completion of VS Code does not work in many places. Second, it bumps up against various limits of the TypeScript language server, leading to various problems during development. An example is this issue: [TypeScript does not load...](https://github.com/directus/sdk/issues/98)

My SDK is almost completely type safe. This starts with defining your own collections and ends with the return value of functions like `readItem`. Even relationships between items can be mapped completely type safe.

### No dependencies

This SDK builds on existing web APIs like the Fetch API and therefore has no dependencies and can run in any environment. Be it in Node.js, the browser or on the edge. Newer environments like Bun or Deno are also likely to be supported. This reduces the bundle size, provides maximum flexibility and does not prevent future innovations that we currently cannot know about.

## How it works

In the following I explain how the SDK works and point out further advantages.

### Install the SDK

At this time, the SDK is not yet available via npm, yarn or pnpm. However, I have added an installable version to the GitHub repository.

```bash
npm install https://github.com/fabian-hiller/directus-sdk/raw/main/directus-sdk-0.1.0.tgz
```

### Define your collections

First you define the items of your collections. The types `Item`, `Relation`, `ItemKey` and `Json` helps you to ensure type safety. I expect to improve the types in the future to reach full type safety at some point. Until then, you must follow the rules below.

Make sure that the type definition corresponds exactly to your database. For example, there are no optional or undefined fields in an SQL database (marked with a question mark in TypeScript). Your field should be optional `null` instead. Then you have to make sure that you don't optionally specify the type of the foreign key in relationships. The SDK automatically detects from your query whether the foreign key or the actual data is returned.

To make it very simple, the type definition of a field must match one of the 8 options below. A mix can currently still lead to bugs.

```ts
import { Item, Relation, ItemKey, Json } from 'directus-sdk';

type MyItem = Item<{
  option1: ItemKey;
  option2: string | null;
  option3: number | null;
  option4: boolean | null;
  option5: string[] | null;
  option6: Json<{}> | null;
  option7: Relation<OtherItem> | null;
  option8: Relation<OtherItem>[];
}>;
```

#### Practical example

```ts
import { Item, Relation, ItemKey, Json, DirectusUserItem } from 'directus-sdk';

type PostItem = Item<{
  id: ItemKey;
  title: string;
  content: string;
  author: Relation<DirectusUserItem>;
  comments: Relation<CommentItem>[];
  metadata: Json<Record<string, string>>;
  tags: string[];
}>;

type CommentItem = Item<{
  id: ItemKey;
  author: Relation<DirectusUserItem>;
  text: string;
}>;

type MyCollections = {
  posts: PostItem;
  comments: CommentItem;
};
```

### Create a Directus client

Next, you create a Directus client. You decide whether it is a public, admin or user client. The public client can only access public content of the CMS. The admin client can access everything using a static token of an admin and the user client can only access the content for which the logged in user has the necessary permissions. The previously created type of the collections is passed as generic.

```ts
import { getPublicClient, getAdminClient, getUserClient } from 'directus-sdk';

const publicClient = getPublicClient<MyCollections>({
  url: 'https://example.com',
});

const adminClient = getAdminClient<MyCollections>({
  url: 'https://example.com',
  staticToken: 'ADMIN_TOKEN_HERE',
});

const userClient = getUserClient<MyCollections>({
  url: 'https://example.com',
  setTokens: (tokens) => { /* Save tokens e.g. as cookies here  */ }
  getTokens: () => { /* Return tokens e.g. from cookies here  */ }
});
```

### Call a function

The SDK provides functions for most of the Directus CMS endpoints. The previously created client is passed to each function as the first parameter. Its information is used to call the CMS and make the function type-safe.

#### Auth functions

The auth functions are usually called with a user client.

- login
- logout
- refresh
- requestPassword
- resetPassword

##### Example

After a user submits the login form, the following function can be used for login.

```ts
import { login } from 'directus-sdk';

await login(userClient, {
  email: 'user@example.com',
  password: '123456789',
});
```

#### Items functions

The items functions map all CRUD operations that the endpoints of the CMS allow. Using [function overloads](https://www.typescriptlang.org/docs/handbook/2/functions.html#function-overloads), `updateItems` can update multiple items based on primary keys, multiple items based on a query, or multiple items in a batch and all in a type-safe way. Alternatively, we could provide a single function for each operation. However, this would complicate the naming.

- createItem
- createItems
- readItem
- readItems
- updateItem
- updateItems
- deleteItem
- deleteItems

##### Special feature

Using a new syntax of the `fields` query option, the specification of the fields to be requested as well as the return value is completely type safe. Even relationships are fully taken into account.

```ts
import { readItem } from 'directus-sdk';

const post = await readItem(publicClient, 'posts', 'PRIMARY_KEY', {
  fields: {
    title: true,
    content: true,
    author: {
      first_name: true,
      avatar: {
        url: true,
      },
    },
    comments: '*',
    tags: true,
  },
});
```

#### Users functions

Other endpoints such as `/users` can be built on top of the items functions to prevent the same code from being written multiple times.

- createUser
- createUsers
- readCurrentUser
- readUser
- readUsers
- updateCurrentUser
- updateUser
- updateUsers
- deleteUser
- deleteUsers
