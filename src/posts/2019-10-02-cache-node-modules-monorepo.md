---
title: Cache node_modules for Monorepo
date: "2019-10-02"
tags: ['cache', 'continuous integration', 'monorepo', 'node_modules']
author: "Chih-Ching Chang"
path: "/cache-node-modules-monorepo"
---

Most continuous integration platforms provide functinoalities of cache mechanism, such as [GitLab](https://docs.gitlab.com/ee/ci/caching/), [Travis CI](https://docs.travis-ci.com/user/caching/) or [Circle CI](https://circleci.com/docs/2.0/caching/). The cache mechanism helps us store those dependencies that are not often changed, and therefore save us a bunch of time to prevent retreiving them via the internet again.

However, we are using Jenkins on [k8s](https://kubernetes.io/docs/concepts/overview/what-is-kubernetes/). Every job will start a new [pod](https://kubernetes.io/docs/concepts/workloads/pods/pod/). Keeping only one version of `node_modules` could be feasible via global cache, but it might also lead to race condition if every job wants to read or write the files. We could bypass this issue if we disallow jobs running concurrently. Yet, this leads to performance issue if we really want to run many jobs at the same time.

Thus, we would like to utilize aws s3 as a temporary storage and build our own cache mechanism. We wrote a short shell script to help us do so.

First, we use md5 checksum of `yarn.lock` to produce a hash number to help us check if these packages have been installed before. If it does not already exist in our s3 _cache bucket folder_, then we will need to execute `yarn install` for our new libraries. If it does exist, we can just download it from s3 to save our time.
Our implementation is pretty similar to [this one](https://dev.to/khsing/speed-up-jenkins-with-npm-build-3pc), except that we use `yarn.lock` but not `package.json`.

```bash
# yarn install with cache if it exists

PKG_SUM=$(md5sum yarn.lock | cut -d " " -f 1)
TARBALL=node_modules-${PKG_SUM}.tgz
TARBALL_CACHE_FOLDER=./.nodeModulesTarball
S3_TARBALL_FOLDER=s3://s3_bucket/__nodeModulesTarball__

[[ ! -e $TARBALL_CACHE_FOLDER ]] && mkdir -p $TARBALL_CACHE_FOLDER

function downloadTarballIfNotExist() {
  pushd $TARBALL_CACHE_FOLDER
  if [ ! -f $TARBALL ]; then
    aws s3 cp --quiet ${S3_TARBALL_FOLDER}/${TARBALL} $TARBALL || echo ${TARBALL} "does not exist on S3"
  fi
  popd

}

function extractTarballIfExist() {
  if [ -f ${TARBALL_CACHE_FOLDER}/${TARBALL} ]; then
    tar -zxf ${TARBALL_CACHE_FOLDER}/${TARBALL}
  else
    echo $TARBALL "does not exist"
  fi
}

downloadTarballIfNotExist
extractTarballIfExist
yarn --no-progress --pure-lockfile
```

For the uploading part, we do something like the following code snippet. We first check if this version is uploaded before and only upload it if that's the case.

```bash{8}
PKG_SUM=$(md5sum yarn.lock | cut -d " " -f 1)
TARBALL=node_modules-${PKG_SUM}.tgz
TARBALL_CACHE_FOLDER=./.nodeModulesTarball
S3_TARBALL_FOLDER=s3://s3_bucket/__nodeModulesTarball__

function uploadTarballIfHasNotUploadedBefore() {
  if [ ! -f ${TARBALL_CACHE_FOLDER}/${TARBALL} ]; then
    tar -zcf ${TARBALL_CACHE_FOLDER}/${TARBALL} ./node_modules ./*/node_modules/ || return 1
    aws s3 --quiet cp ${TARBALL_CACHE_FOLDER}/${TARBALL} ${S3_TARBALL_FOLDER}/${TARBALL} || return 1
  fi
}
```

It is worth noting that we use [`yarn workspace`](https://yarnpkg.com/lang/en/docs/cli/workspace/) for our apps, i.e., we have a big monorepo to handle different projects. Normally, when caching `node_modules` on CI platform, it will only cache the one in the root folder. Looking at line 8 (highlighted one) of the above snippet, we customize a bit for our situation. We not only keep the root `node_modules`, but also cache all `node_modules` under sub-projects. Theoretically, [symbolic links](https://yarnpkg.com/lang/en/docs/workspaces/#toc-how-to-use-it) will be kept in the zipped files, so `yarn workspace` would work just fine.

Since we have a huge monorepo, our performance improves drastically after using cache. (Could improve **from 3 minutes to 30 seconds**, which is about 6 times faster for `yarn install`.)

_We also use a lot of different procedures to help us save time on CI pipelines. I might document them down someday later :p_