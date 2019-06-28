---
title: Send form data with bs-fetch
date: "2018-02-13"
tags: [reasonml, bs-fetch, formData]
author: "Chih-Ching Chang"
path: "/form-data-bs-fetch"
---

I’m now learning [ReasonML](https://reasonml.github.io/), which is a new functional programming language combining features of OCaml and JavaScript.

This article is just a note of trying [bs-fetch](https://github.com/reasonml-community/bs-fetch) and 
is a slight extension of this [article](https://qiita.com/ma2k8/items/0bda8a897491ded334e8). 
[API document](https://github.com/reasonml-community/bs-fetch/blob/master/src/Fetch.ml) of bs-fetch 
might not be super clear if you are a beginner (and I am!). 
Thus, I would like to keep some notes for myself through my ReasonML learning process.

Simple examples of using bs-fetch can be seen in its repository. 
Here, I’m trying to send requests with some initial settings, such as headers or methods. 
Below is the code snippet of sending a POST request with form data 
and using [bs-qs](https://www.npmjs.com/package/bs-qs) as helper.

`gist:eyeccc/d70ef8d0bceed5d2e677a1db1aa4cb8b`

Or, alternatively, you can try to write some simple bindings. :)

`gist:eyeccc/4a915eca01746d8f181451f97a996a2c`

This article is originally published on my [Medium](https://medium.com/@eyeccc/note-of-bs-fetch-3085628de2b3).