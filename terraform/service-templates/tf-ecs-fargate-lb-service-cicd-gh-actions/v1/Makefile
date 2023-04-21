template := tf-ecs-fargate-lb-service-cicd-gh-actions
key := proton-service-template.tar.gz
description := "Load Balanced ECS Fargate Service with a GitHub Actions CI/CD Pipeline"

all: help

.PHONY: help
help: Makefile
	@echo
	@echo " Choose a make command to run"
	@echo
	@sed -n 's/^##//p' $< | column -t -s ':' |  sed -e 's/^/ /'
	@echo

## template: create a service template and register a version, ex. `make template bucket=my-bucket version=1`
.PHONY: template
template:
	aws proton create-service-template \
		--name ${template} \
		--display-name ${description} \
		--description ${description}

	tar -zcvf ${key} schema instance_infrastructure pipeline_infrastructure
	aws s3 cp ${key} s3://${bucket}/${key}
	rm ${key}

	aws proton create-service-template-version \
		--template-name ${template} \
		--description "registered from CLI" \
		--compatible-environment-templates="majorVersion=1,templateName=tf-vpc-ecs-cluster" \
		--source s3="{bucket=${bucket},key=${key}}"

	aws proton wait service-template-version-registered \
		--template-name ${template} --major-version ${version} --minor-version 0

	aws proton update-service-template-version \
		--template-name ${template} --major-version ${version} --minor-version 0 --status PUBLISHED
