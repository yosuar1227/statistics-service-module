//lambda to get stats of the specific url by code
import { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";
import createHttpError from "http-errors";
import middy from "@middy/core";
import httpErrorHandler from "@middy/http-error-handler";

const getStatsByCodeLambda = async (
    event: APIGatewayEvent
): Promise<APIGatewayProxyResult> => {

    const urlCode = event.pathParameters?.codigo;

    if (!urlCode) {
        throw createHttpError.BadRequest("Missing mandatory 'codigo' parameter value.");
    }

    return {
        statusCode: 200,
        body: JSON.stringify({ success: true }),
        headers: {
            "Content-type": "application/json"
        }
    }
}

export const handler = middy<APIGatewayEvent, APIGatewayProxyResult>(
    getStatsByCodeLambda
)
    .use(httpErrorHandler())