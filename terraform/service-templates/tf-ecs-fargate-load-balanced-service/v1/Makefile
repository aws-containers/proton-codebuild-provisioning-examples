template := ecs-fargate-load-balanced-service
key := proton-service-template.tar.gz

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
		--display-name "Load Balanced ECS Fargate Service" \
		--description "Load Balanced ECS Fargate Service" \
		--pipeline-provisioning CUSTOMER_MANAGED

	tar -zcvf ${key} schema instance_infrastructure
	aws s3 cp ${key} s3://${bucket}/${key}
	rm ${key}

	aws proton create-service-template-version \
		--template-name ${template} \
		--description "registered from CLI" \
		--compatible-environment-templates="majorVersion=1,templateName=vpc-ecs-cluster" \
		--source s3="{bucket=${bucket},key=${key}}"

	aws proton wait service-template-version-registered \
		--template-name ${template} --major-version ${version} --minor-version 0

	aws proton update-service-template-version \
		--template-name ${template} --major-version ${version} --minor-version 0 --status PUBLISHED