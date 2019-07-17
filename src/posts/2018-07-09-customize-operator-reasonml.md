---
title: Customize Operator in ReasonML
date: "2018-07-09"
tags: [reasonml, customize, operator]
author: "Chih-Ching Chang"
path: "/customize-operator-reasonml"
---

This topic is inspired by the post: https://twitter.com/_astrocoders/status/1013466409156870147

It could be messy when writing a lot of if-else in your code. 
It could be something like the following:

`gist:eyeccc/868450b630cec81f66d0f41f893e3f12`

The code looks not so elegant although it still works.

Alternatively, according to this [tweet](https://twitter.com/_astrocoders/status/1013466409156870147), 
we know that we can 
customize operators in ReasonML. Therefore, we could utilize this 
feature and implement something like this:

`gist:eyeccc/ecf0584199ec4f74cce9ae427a723337`

We could either declare our own customized operator in the same 
file or put it in another util file. From the above example, 
I make `>>=` as a function that takes an object, a function, and a condition. 
It basically evaluates the given condition: if it’s true, then apply the 
function to the object; otherwise, it returns the original object.

In `App.re` , we could use this customized operator (similar to the pipe operator `|>`) 
elegantly to pass down the object all the way and also use it directly 
as an input to another function.

e.g., `obj >>= (fun1, cond1) >>= (fun2, cond2) |> stringifyObjToJson`

There are more examples here: https://github.com/Risto-Stevcev/bs-abstract/ if 
you want to use others’ definition of operators.

This article is originally published on my [Medium](https://medium.com/@eyeccc/customize-operator-in-reasonml-8a2625f87760).