---
title: Intro to GraphQL Federation
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

3. 單一集中管理的 schema：
