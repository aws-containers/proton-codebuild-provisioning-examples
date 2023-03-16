template := tf-vpc-ecs-cluster
key := proton-environment-template.tar.gz

all: help

.PHONY: help
help: Makefile
	@echo
	@echo " Choose a make command to run"
	@echo
	@sed -n 's/^##//p' $< | column -t -s ':' |  sed -e 's/^/ /'
	@echo

## template: create an environment template and register a version, ex. `make template bucket=my-bucket version=1`
.PHONY: template
template:
	aws proton create-environment-template \
		--name ${template} \
		--display-name "Environment for ECS Fargate" \
		--description "Environment for provisioning ECS Fargate services"

	tar -zcvf ${key} schema infrastructure
	aws s3 cp ${key} s3://${bucket}/${key}
	rm ${key}

	aws proton create-environment-template-version \
		--template-name ${template} \
		--description "registered from CLI" \
		--source s3="{bucket=${bucket},key=${key}}"

	aws proton wait environment-template-version-registered \
		--template-name ${template} --major-version ${version} --minor-version 0

	aws proton update-environment-template-version \
		--template-name ${template} --major-version ${version} --minor-version 0 --status PUBLISHED