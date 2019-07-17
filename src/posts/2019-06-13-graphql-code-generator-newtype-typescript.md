---
title: Utilize GraphQL Code Generator for newType in Typescript
date: "2019-06-13"
tags: ['graphQL', 'typescript']
author: "Chih-Ching Chang"
path: "/graphql-code-generator-newtype-typescript"
---

Recently we started building our new features with GraphQL and Typescript. The reason why we chose to use type system is because we suffered from the runtime error in our legacy code a lot (the notorious `undefined is not a function`😅).

After digging into how Typescript works, we figured out that it can achieve the same characteristic of [newType similar to Haskell](https://wiki.haskell.org/Newtype). `newType` introduces the benefit of not mixing different fields with the same type. For instance, both your email and phone number can be represented by `string` , but they have quite different meaning. If we only use type alias for them, then Typescript type-check cannot figure out they are different. [Here is a more thorough explanation of newType in Typescript](https://www.everythingfrontend.com/posts/newtype-in-typescript.html).

<h2>But how do we combine newType in Typescript with GraphQL schema?</h2>

When using [GraphQL code generator](https://graphql-code-generator.com/), normally we will get something similar to the following generated schema from our GraphQL server:

`gist:eyeccc/f85abad51b005b8883da3f8330326086`

As we know, although name and email are both `string` , they have quite different concept. In this case, if you accidentally pass a person’s name to a function that only accepts email, type checker won’t yell at it. Now we would like to make our app more type-safe by adding newType into it!

From the backend part (i.e., GraphQL server), you will need to add a new type, say `Email`. After re-generating your schema by code generator, you will get the following result:

`gist:eyeccc/1a1a23b0a1c546b3fe6748b1369264af`

Now we have a new Scalar type: `Email` . However, its type becomes `any` , which is not type-safe at all :(

Luckily, we can [override the built-in scalars and custom GraphQL scalars to a custom type](https://graphql-code-generator.com/docs/plugins/typescript-resolvers#scalars-scalarsmap) by GraphQL code generator 🎉. Simply adding the magic newType declaration for it in your `.yml` file.

`gist:eyeccc/15f049aaa2efc2005e331c28f54ae105`

The above example makes Email a newType, i.e., it is not just `string` anymore. And re-generating your schema will get the following:

`gist:eyeccc/a7b930f81fe49f82990c25d41224c93e`

Now, when you accidentally pass any string that is not with type `Email` , type checker will tell you! Just like the following:

`gist:eyeccc/ed4950e6f24b1d3b76346af391010265`

Now your app is more type-safe :)

This article is originally published on my [Medium](https://medium.com/@eyeccc/utilize-graphql-code-generator-for-newtype-in-typescript-183b1c73a21d).