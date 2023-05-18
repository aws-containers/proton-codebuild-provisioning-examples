import input from "./proton-inputs.json";

const serviceOutputs: { [index: string]: any } = input.service_instances;

const result = [
  ...new Set(
    serviceOutputs.map(
      (service: any) =>
        `arn:aws:proton:us-west-2:${service.environment.account_id}:environment/${service.environment.name}*,`
    )
  ),
];

console.log(typeof Array.from(result));
