---
title: Renovate Bot on Bitbucket Cloud Pipeline
date: "2019-09-02"
tags: ['renovate', 'bitbucket', 'bitbucket cloud', 'pipeline']
author: "Chih-Ching Chang"
path: "/renovate-bitbucket-cloud"
---

[Renovate](https://github.com/renovatebot/renovate) is a tool that automatically upgrades your packages. You can get it from [Github marketplace](https://github.com/marketplace/renovate) and easily use it to automate your package upgrade procedure on Github. We think it is good to use renovate bot to keep our packages up-to-date without much effort and would like to give it a try.

While Renovate supports a variety of platforms, its [Bitbucket Cloud version](https://github.com/renovatebot/renovate/tree/master/lib/platform/bitbucket) seems to still be a beta version right now. Thus, I would like to document my trial and errors while configuring renovate on Bitbucket Cloud pipeline.

When you try to run renovate bot for the first time, it will create an [onboarding pull request](https://docs.renovatebot.com/configure-renovate/) with empty `renovate.json` config and update nothing. It is just an overview of what future pull requests might look like. You could modify `renovate.json` to customize your bot.

There are plenty of [options](https://docs.renovatebot.com/configuration-options/) for your config. The simplest way might be using their [default config presets](https://docs.renovatebot.com/presets-config/) to see if that meets your requirements.

For example:

```
{
  "extends": [
    "config:base"
  ]
}
```

If that does not meet what you want, you could modify it accordingly. For instance, if I only want one big pull request that updates every package, I could use [`groupName`](https://docs.renovatebot.com/configuration-options/#groupname).

```
{
  "extends": [
    "config:base"
  ],
  "groupName": "all"
}
```

To test renovate bot on Bitbucket Cloud, you could set up the following steps in your bitbucket pipeline:

```
pull-requests:
  '**':
    - step:
        name: Upgrade by Renovate Bot
        script:
          - renovate --password=$BITBUCKET_SECRET --username=$BITBUCKET_USER --platform=bitbucket owner/repo_name

```

You could run `renovate --platform=bitbucket` to try your config. A strange part is somehow renovate does not understand `platform` in `renovate.json`, you need to add it explicitly on renovate CLI command.
Also, the most annoying part of your config experiments is that it only works on master branch by default. Thus, you cannot directly try the new config on your pull request branch :(