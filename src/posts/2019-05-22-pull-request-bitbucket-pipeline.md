---
title: Run CI / CD by Pull Requests on Bitbucket pipeline
date: "2019-05-22"
tags: ['continuous delivery', 'continuous integration', bitbucket, docker]
author: "Chih-Ching Chang"
path: "/pull-request-bitbucket-pipeline"
---

Recently I have the opportunity to build CI/CD for our projects. The requirements are running unit tests by pull requests and deploy the current version of the pull requests to our development server, then sending a preview link after it’s done. By doing so, we can let stakeholders test on new features before rolling out to production.

Since we use Bitbucket as part of our service, we would like to take advantage of its functionality. Luckily, Bitbucket just released a new version of bitbucket pipeline that allows users to trigger its pipeline by pull requests ([ref1](https://confluence.atlassian.com/bitbucket/configure-bitbucket-pipelines-yml-792298910.html#Configurebitbucket-pipelines.yml-ci_pull-requests), [ref2](https://community.atlassian.com/t5/Bitbucket-questions/Can-I-trigger-Bitbucket-pipeline-with-pull-request/qaq-p/226236)) in October 2018!

What we need to do is to simply write a bitbucket-pipelines.yml file, such as the following:

`gist:eyeccc/987f17f7ab26869959aaff4ee97e5541`

The image is the environment/docker image that you need to run your pipeline. 
You can get the public ones from [dockerhub](https://hub.docker.com/_/node) easily or create your own 
one and push to dockerhub ([see how to push your docker image](https://ropenscilabs.github.io/r-docker-tutorial/04-Dockerhub.html)). 
After that, all you need is to type in the scripts to test or build your project.

We host our static files on [AWS S3](https://aws.amazon.com/premiumsupport/knowledge-center/cloudfront-https-requests-s3/). Thus, we need to sync the builds to our S3 buckets. 
Then, just like [now.sh does for deployment](https://github.com/apps/now), 
we only need to make a post request (check [Bitbucket api doc](https://developer.atlassian.com/bitbucket/api/2/reference/resource/repositories/%7Busername%7D/%7Brepo_slug%7D/pullrequests/%7Bpull_request_id%7D/comments)) 
to comment the preview link to our pull request on Bitbucket. 
There are plenty of [environment variables](https://confluence.atlassian.com/bitbucket/variables-in-pipelines-794502608.html) available in bitbucket pipeline if you need any of them. You might face some authentication issue when making post request. 
What I did is making an app password/token for my comment bot (check how to create it [here](https://confluence.atlassian.com/bitbucket/app-passwords-828781300.html)). 
Alternatively, you could use [OAuth](https://confluence.atlassian.com/bitbucket/oauth-on-bitbucket-cloud-238027431.html) to solve authentication issue.

That’s it! 😄

This article is originally published on my [Medium](https://medium.com/@eyeccc/run-ci-cd-by-pull-requests-on-bitbucket-pipeline-28017ee7345a).