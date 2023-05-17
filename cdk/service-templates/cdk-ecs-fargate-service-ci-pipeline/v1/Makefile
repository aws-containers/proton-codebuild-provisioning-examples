template := cdk-ecs-fargate-pipeline-ci-service
key := cdk-ecs-fargate-pipeline-ci-service.tar.gz
version := 1
minor_version := 0
service_name := cdk-ecs-fargate-pipeline-ci-service

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
	if [[ -z "${bucket}" ]]; then echo "S3 Bucket argument is required \"bucket=s3-bucket-name\""; exit 1; fi

	aws proton create-service-template \
		--name ${template} \
		--display-name "Load Balanced ECS Fargate Service w/ CI Pipeline" \
		--description "Load Balanced ECS Fargate Service w/CI Pipeline"

	tar --exclude="node_modules" --exclude="cdk.out" --exclude="cdk.context.json" -zcvf \
	  ${key} schema instance_infrastructure pipeline_infrastructure
	aws s3 cp ${key} s3://${bucket}/${key}
	rm ${key}

	aws proton create-service-template-version \
		--template-name ${template} \
		--description "registered from CLI" \
		--compatible-environment-templates="majorVersion=1,templateName=cdk-vpc-ecs-cluster" \
		--source s3="{bucket=${bucket},key=${key}}" \
		--major-version ${version} 

	aws proton wait service-template-version-registered \
		--template-name ${template} --major-version ${version} --minor-version ${minor_version}

	aws proton update-service-template-version \
		--template-name ${template} --major-version ${version} --minor-version ${minor_version} --status PUBLISHED
