#!/bin/bash
npm run publish:public

version=`npm view @aitmed/ecos-lvl1-sdk version`
git tag -a $version -m "release a new version: $version"
git push origin $version
git push