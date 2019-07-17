---
title: Using Keycloak in ReasonML
date: "2018-09-18"
tags: [reasonml, keycloak]
author: "Chih-Ching Chang"
path: "/keycloak-reasonml"
---

[Keycloak](https://www.keycloak.org/) is an open source product to manage identity and access for modern applications and services. There is a client-side library ([Keycloak-js](https://github.com/keycloak/keycloak-js-bower)) that can be used to make secured application.

Recently I have been trying to integrate keycloak-js into my reason app for 
the first time and searched online to find a more elegant way to cope with it. 
I got some ideas from these two posts: [[1]](https://reasonml.chat/t/how-to-improve-my-codes/663), [[2]](https://reasonml.chat/t/it-did-not-generate-the-right-code/726). Below are some of my learning notes.

I did similar thing like what the above two posts did to 
initialize keycloak in my app. `myConfig` should be your personal keycloak config json file.

`gist:eyeccc/c39e2f31131b43dbef2a2a664cfd5119`

`gist:eyeccc/9992d56f459a913b58f44ac76d0fee50`

We can call `keycloak` when our reason app is mounted; 
therefore, we are able to check if the incoming user is authenticated 
to view the secured part of our app ([ref](https://blog.scalac.io/user-authentication-with-keycloak-part1.html)). If all the other things are 
processed on the server side, then we’re done.

*However*, I think a better way to manage authentication is to integrate Keycloak on the server side (so that we won’t expose our access token or maybe other information on the client side). That’s said we have a backend that is ready to be integrated. All we need to do at frontend is to redirect users to login api when other endpoints response 401 status code. Everything will be as simple as the following code snippet:

`gist:eyeccc/e892fcf292b086b28d30977a4853b81a`

We don’t need to use keycloak-js anymore. Everything is handled on the server side and we don’t need to ask authentication from keycloak from both frontend and backend. Note that if user does not have permission: e.g., not an admin, (instead of not logging in to keycloak), it’s better to handle 403 status code somewhere else.

This article is originally published on my [Medium](https://medium.com/@eyeccc/using-keycloak-in-reasonml-29897f13edaa).