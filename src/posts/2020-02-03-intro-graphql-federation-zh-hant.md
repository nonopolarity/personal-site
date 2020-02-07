---
title: 淺談 GraphQL Federation
date: "2020-02-03"
tags: ['graphql', 'federation', 'zh-hant']
author: "Chih-Ching Chang"
path: "/intro-graphql-federation-zh-hant"
---

Apollo 在 2019 年 5 月的時候推出了 Apollo Federation，
藉以解決多個 microservice 可能遭遇的問題的方法。
在擁有越來越多個 microservice 的時候，
前端使用者難免會遇到需要打多個 GraphQL endpoint 來取得所有想要的資料，
如此一來，與 restful 相比，GraphQL 所帶來的單一 resource 的便利性便可能消失。

對前端來說，理想上同一個 app 應該只需要一個大的 graph 來拿資料，
然而單一一個巨大的 graph 卻又對 microservice 的後端架構的維護性造成負面的影響，
因此，Apollo 提出的 Federation 所帶來的好處是，
保有後端想要不同 microservice 處理他們各自的邏輯，
並把所有 microservice 的 graph 整合且 expose 成一個巨大的 graph 方便使用者來取得資料。

Apollo Federation 是依據以下[幾個原則](https://principledgraphql.com/integrity)來設計的：
1. 一個單一的 Graph：
開始有了越來越多個 Graph 之後，每個組難免會開始「重造輪子」，有重複但不一致的邏輯，所以我們需要有單一的 graph 來集中管理，不只使用者可以直接獲得他想要的資料，也可以減少繁雜錯亂的重複邏輯。

2. 聯合的實作：如果直接實作一個巨大的 graph，系統上可能會難以 scale up，利用這樣聯合（federated）的方式，我們能夠使每個組只要專注在自己負責的那塊 graph 就好。

3. 單一集中管理 schema 版本：我們需要在一個地方集中管理 schema 的版本，而不是任意依照每個底下的服務隨意變更版本。

Apollo Federation 提供了兩個開源的函式庫：`@apollo/federation` 和 `@apollo/gateway`，
利用這兩個 library，我們可以逐步將每個子 service 慢慢引入支援 federation。
值得注意的是，千萬不要因為有了 federation 就認為必須依照每個不同的 type 來拆分 service，
官方建議依照你的 feature 或 team 來拆分會比較合理，
因為每個 type 所擁有的資訊可能會在各種不同的 feature 用到。

## 範例

接下來利用簡單的範例來介紹怎麼逐步將原本的服務導入 Federation。
假設我們提供給使用者一個服務，這個服務能做到以下幾件事情：
1. 使用者（`User`）可以對某張照片（`Photo`）上網拍賣（`Auction`）
2. 使用者（`User`）可以對某個拍賣（`Auction`）競標（`Bid`）
3. 每張照片（`Photo`）都是某個使用者（`User`）的寵物（`Pet`）

先不論怎麼拆分這個服務比較好，假設我們已經有兩個 team 分別處理和管理這個服務：
1. 拍賣的 server
2. 照片的 server

而這兩個 server 分別提供了以下兩個 GraphQL schema：

```graphql
// Auction Server
type User {
   id: ID!
   username: String!
   auctionHistory: [Auction]
}

type Auction {
   id: ID!
   name: String!
   photo: Photo!
   offers: [Bid]
   highestOffer: Bid
}

type Bid {
   user: User!
   amount: Int
}

type Photo {
   id: ID!
}

type Query {
   allAuctions: [Auction!]!
}

```

```graphql
// Photo Server
enum Species {
   Dog
   Cat
}

type Pet {
   name: String!
   id: ID!
   species: Species
   breed: String!
   owner: User!
   photos: [Photo!]!
}

type Photo {
   id: ID!
   pet: Pet!
   url: String!
}

type User {
   id: ID!
   favoritePhoto: Photo
   photoGallery: [Photo]
}

type Query {
    allPhotos: [Photo!]!
}

```

我們可以從這兩個 schema 裡發現，這裡有兩種類型的 type，一個是兩個 server 都會使用到的 type：Boundary Type（如：`User`），另個是只有各自才會使用到的 type：Domain Type（如：`Auction`）。

Boundary Type 在支援 Federation 的情況下是我們比較需要注意的，要怎麼讓使用者感覺這兩個 server 的同一個 type 是一樣的呢？例如 `User` 在兩個 server 都有的情況下，我們希望底下所有的 service 都知道其他 service 的欄位定義，也希望使用者能夠有單一的 type 就拿到兩個 server 底下定義的所有欄位。

為了讓這件事情發生，我們需要利用 Apollo Federation 裡面提供的 keyword 來標記這些跨 server 的 type。
以 `User` 來舉例，我們利用 `@key` 來將 `User` 變成一個 entity，
而 `@key` 後面所定義的 `fields: "id"` 則是這個 entity 能夠被其他 service 所辨識的他是某個特定 instance 的欄位，它可以是 id 或是任何多個欄位的組合。
下面的例子假設 Photo Server 擁有這個 entity。

```graphql
// Photo server
type User @key(fields: "id")  {
  id: ID!
  favoritePhoto: Photo
  photoGallery: [Photo]
}
```

而其他的 service 若想要獲得這個 entity 底下的資訊，我們需要增加 `extend` 和 `@external`，
extend 代表這個 type 是存在於其他 server 的 entity，
而 `@external` 則是表示這個欄位是在其他 service 所定義的。
以下面的 Auction Server 來說，
Auction Server 的 `User` 是定義在 Photo Server 上面的 entity，
然後 `id` 是在 Photo Server 上面所定義的欄位，
實際上 Auction Server 只處理到 resolve `username` 和 `auctionHistory` 的部分。
要注意的是，每個地方用到的 `@key` 必須要一致，
所以 Photo Server 和 Auction Server 的 `User` 都必須使用 `id` 來當作 key。

```graphql
// Auction server
extend type User @key(fields: "id") {
  id: ID! @external
  username: String!
  auctionHistory: [Auction]
}
```

在我們對 type 做好擴充之後，接下來我們必須要讓 resolver 知道要怎麼處理跨 server 的 entity，
假設原本的 photo server 的 resolver 是底下的樣子：

```js
const { ApolloServer, gql } = require('apollo-server');

// OMIT: const typeDefs = ...

const resolvers = {
  Query: {
    allPhotos: () => photos,
  },
};

const server = new ApolloServer({ typeDefs, resolvers });
```

我們需要讓擁有這個 entity 的 server 知道他本身是要被 federate 的：

```js
const { ApolloServer, gql } = require('apollo-server');
const { buildFederatedSchema } = require('@apollo/federation');

// OMIT: const typeDefs = ...

const resolvers = {
  Query: {
    allPhotos: () => photos,
  },
  User: {
    __resolveReference(user, { findUserById }) {
      return findUserById(user.id);
      // should implement actual logic of findUserById
    }
  },
};

const server = new ApolloServer({
  schema: buildFederatedSchema([{ typeDefs, resolvers }])
});
```

我們利用 Apollo 提供的套件 `@apollo/federation`，加上新的 `User` 的 resolver 來實現這件事。
這個 `User` 的 resolver 可以想成是，因為我們利用 `id` 做為某個 instance 的 key，
所以在其他 server 呼叫的時候，我們要透過這個 id 去拿對應的 user 的相關資料。

如此一來，我們的 Photo Server 和 Auction Server 都已經被「federated」了，
接下來我們需要處理集中這兩個 server 的 schema 的 gateway server，
理想上來說，
gateway server 應該要統一處理掉認證等問題，
有了 gateway server 之後，其他 server 的 graph 都不應該直接給使用者看到，
使用者必須透過這個 gateway server 來獲取所有他想要的資料。

```js
// Gateway Server
const { ApolloServer } = require('apollo-server');
const { ApolloGateway } = require("@apollo/gateway");

// Initialize an ApolloGateway instance and pass it an array of implementing
// service names and URLs
const gateway = new ApolloGateway({
  serviceList: [
    { name: 'auctions', url: 'http://localhost:4001' },
    { name: 'photos', url: 'http://localhost:4000' },
    // more services
  ],
});

// Pass the ApolloGateway to the ApolloServer constructor
const server = new ApolloServer({
  gateway,

  // Disable subscriptions (not currently supported with ApolloGateway)
  subscriptions: false,
});

server.listen({port: 4100}).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
```

上面是一個簡易版的 gateway server，
我們利用 server list 來列舉所有底下的 service，
然後 apollo 的套件會幫我們把兩個 graph 的 schema 合為一個提供給使用者，
完整的 demo 可以在這個 [repository](https://github.com/eyeccc/apollo-graphql-federation-example) 試玩。

## 注意一些小細節

除了上面範例以外，還有一些官方文件寫的小細節需要注意：
1. [所有用到的 ValueType 在每個 service 必須一致](https://www.apollographql.com/docs/apollo-server/federation/core-concepts/#value-types)：
例如 Objects, Scalars, Enums 等 ValueType，以 Enum 來說，
就算你的 service 只有用到 Enum 裡面的一小部分，你也必須列舉出所有可能的 Enum。
2. 上面列舉 server 的方式並不是有效管理 schema 的方法，
很有可能底下一個 server 在開發後改變了自己的 schema，而造成整個 federated graph 壞掉，
這個時候官方提供了 [Apollo Graph Manager](https://engine.apollographql.com/?utm_source=docs-button) 來幫助我們管理 schema 的版本。

## Apollo Graph Manager

[Apollo Graph Manager](https://www.apollographql.com/docs/graph-manager/) 是官方提供的管理 schema 的方法，它提供了以下[三種功能](https://blog.apollographql.com/announcing-managed-federation-265c9f0bc88e)：
1. 分析診斷（Analytics and diagnostics）：提供了 query 的使用情形，以供我們分析診斷要怎麼改善現有的架構。
2. 驗證 schema：在開發新的功能時，我們能透過將它加到 CI 的方式來驗證這樣的改動是否會破壞其他人的 schema。
3. 管理部署（Manage deployment）：如同一般 git 的版本控制，Graph Manager 幫助我們管理部署不同的版本。

## 一些其他的小實驗

當我在嘗試 Apollo Federation 的時候想到了幾個問題：
1. 萬一其中一個子 service 壞了會影響到使用者嗎？

> 目前測試的結果是子 service 壞了，使用者只會在想要獲取那個壞掉的 service 相關的資料的時候才會壞掉。

2. 如果每個 service 是利用不同的實作來呈現（例如 apollo v.s. relay），這樣我們該如何整合呢？

> 如果是利用 Relay 來實作 GraphQL，Facebook 官方的文件表示，他需要符合「[Relay Global Object Identification Specification](https://facebook.github.io/relay/graphql/objectidentification.htm)」，
然而利用 Apollo 實作的 GraphQL 並沒有這個特性，如果兩個 server 的實作細節差異很大，
我們有辦法利用 federation 來整合嗎？
實測的結果是可以利用一樣的方式把每個 service 擁有 federated 的特性。

3. 進階的 authentication 或是 cache 的機制改怎麼處理？

> 目前還沒有實際實驗到這個部分，
但可以想到如果不同的 microservice 有不同的 auth 或是 cache 機制，
我們可能會需要思考該怎麼處理這樣的情形，不同的 cache 時間會影響到我們整個 graph 資料的正確性嗎？

## 其他語言的 GraphQL Federation 套件

Apollo 官方有定義出 Federation Schema 的 [spec](https://www.apollographql.com/docs/apollo-server/federation/federation-spec/)，不同語言如果想要使用 Federation，
基本上只需要依照這個 spec 實作即可，目前已經有的套件有：

- Python: [Graphene](https://pypi.org/project/graphene-federation/), [Ariadne](https://pypi.org/project/ariadne-extensions/)
- Java: [JVM](https://github.com/apollographql/federation-jvm)
- maybe others...?

## 寫在最後

如果有其他的進階實驗，會再寫文章分享心得。

##### Reference:
##### 本篇用到的範例是從[這篇文章](https://itnext.io/a-guide-to-graphql-schema-federation-part-1-995b639ac035)來的。