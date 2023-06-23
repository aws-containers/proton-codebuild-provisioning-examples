exports.handler = async (event, context) => {
	try {
		// Log event and context object to CloudWatch Logs
		console.log("Event: ", JSON.stringify(event, null, 2));
		console.log("Context: ", JSON.stringify(context, null, 2));
		// Create event object to return to caller
		const eventObj = {
			functionName: context.functionName,
			rawPath: event.rawPath,
		};
		const response = {
			statusCode: 200,
			body: JSON.stringify(eventObj, null, 2),
		};
		return response;
	} catch (error) {
		console.error(error);
		throw new Error(error);
	}
};
