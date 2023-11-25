#!/usr/bin/env bash

set -e

# Checkout a new release branch
number=0
branch_start="release/$(date +%Y-%m-%d)"
branch_name="${branch_start}.${number}"
while git rev-parse --verify --quiet ${branch_name} > /dev/null
do
  number=$((number+1))
  branch_name="${branch_start}.${number}"
done
git checkout -b ${branch_name}

# Copy release commit message to clipboard
COMMIT_MSG="Release:"
PACKAGE_LIST=$(git status --porcelain | grep CHANGELOG.md | sed s/^...// | sed s/CHANGELOG.md/package.json/)

for package_file in $PACKAGE_LIST; do
    package_name=$(cat $package_file | jq -r '.name' )
    package_version=$(cat $package_file | jq -r '.version' )
    COMMIT_MSG="$COMMIT_MSG $package_name@$package_version"
done

echo -n $COMMIT_MSG | pbcopy
echo $COMMIT_MSG

echo "^ the commit message has been copied to your clipboard!"
