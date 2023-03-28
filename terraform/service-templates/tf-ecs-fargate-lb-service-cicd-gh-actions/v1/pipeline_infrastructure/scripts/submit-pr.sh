#!/bin/bash
set -e

REPO=$1
USER=$(echo $REPO | cut -d "/" -f 1)
SECRET=$2

# set gh token to value from secrets manager
echo "fetching ${SECRET}"
export GITHUB_TOKEN=$(aws secretsmanager get-secret-value --secret-id ${SECRET} | jq '.SecretString' -r)

# clone repo
GH_ENDPOINT=https://${USER}:$GITHUB_TOKEN@github.com/${REPO}.git
git clone ${GH_ENDPOINT} ${REPO}
cd ${REPO}

# commit deploy.yml
mkdir -p .github/workflows
cp ../../deploy.yml ./.github/workflows/deploy.yml
git checkout -b cicd
git add .
git config --global user.name "github-actions[bot]"
git config --global user.email "github-actions[bot]@users.noreply.github.com"
git commit -m "Proton generated GitHub Actions CI/CD pipeline"

# push commit to remote
echo ""
echo "pushing branch"
git remote set-url origin ${GH_ENDPOINT}
git push ${GH_ENDPOINT}
git fetch origin

# create pull request
echo ""
echo "creating PR"
gh repo set-default ${REPO}
pr=$(gh pr create --fill | tail -1)

# output PR url
aws proton notify-resource-deployment-status-change \
	--resource-arn ${RESOURCE_ARN} \
	--status IN_PROGRESS \
	--outputs "key=workflow,valueString=${pr}"
