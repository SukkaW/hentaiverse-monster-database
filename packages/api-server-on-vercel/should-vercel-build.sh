#!/bin/bash

echo "VERCEL_GIT_COMMIT_REF: $VERCEL_GIT_COMMIT_REF"

# Vercel should only build on the master branch
if [[ "$VERCEL_GIT_COMMIT_REF" == "master" ]]; then
  git diff HEAD^ HEAD --quiet .
  package_api_server_on_vercel_changed=$?
  git diff HEAD^ HEAD --quiet ../server
  package_server_changed=$?

  if [[ $package_api_server_on_vercel_changed == 1 || $package_server_changed == 1 ]]; then
    # Proceed with the build
    echo "✅ - Build can proceed"
    exit 1;
  fi
fi

# Don't build
echo "🛑 - Build cancelled"
exit 0;
