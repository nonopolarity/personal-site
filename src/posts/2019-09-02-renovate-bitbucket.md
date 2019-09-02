---
title: Renovate Bot on Bitbucket Cloud
date: "2019-09-02"
tags: ['renovate', 'bitbucket', 'bitbucket cloud', 'pipeline']
author: "Chih-Ching Chang"
path: "/renovate-bitbucket-cloud"
---

[Renovate](https://github.com/renovatebot/renovate) is a tool that automatically upgrades your packages. You can get it from [Github marketplace](https://github.com/marketplace/renovate) and easily use it to automate your package upgrade procedure on Github. We think it is good to use renovate bot to keep our packages up-to-date without much effort and would like to give it a try.

While Renovate supports a variety of platforms, its [Bitbucket Cloud version](https://github.com/renovatebot/renovate/tree/master/lib/platform/bitbucket) seems to still be a beta version right now. Thus, I would like to document my trial and errors while configuring renovate on Bitbucket Cloud pipeline.

