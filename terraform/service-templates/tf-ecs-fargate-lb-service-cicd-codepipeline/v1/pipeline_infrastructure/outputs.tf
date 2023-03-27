# note that proton currently requires the `PipelineEndpoint`
# output in order to work with the pipeline run console
output "PipelineEndpoint" {
  description = "A link to the generated CodePipeline"
  value       = module.cicd_pipeline.pipeline_endpoint
}
