//lambda to get stats of the specific url by code
import { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";
import createHttpError from "http-errors";
import middy from "@middy/core";
import httpErrorHandler from "@middy/http-error-handler";
import { DynamoService } from "../databases/dynamodb";
import { isValidDate } from "../utils/util.functions";

type StatisticsResponse = {
    success: boolean,
    totalClicks: number,
    linkCode: string,
    clicksInfo: any[],
    totalClicksForCurrentDate: number,
}

const getStatsByCodeLambda = async (
    event: APIGatewayEvent
): Promise<APIGatewayProxyResult> => {

    const urlCode = event.pathParameters?.codigo;
    const filterDate = event.queryStringParameters?.date;

    if (!urlCode) {
        throw createHttpError.BadRequest("Missing mandatory 'codigo' parameter value.");
    }

    if (filterDate && !isValidDate(filterDate)) {
        throw createHttpError.BadRequest("Invalid date, the format must be DD-MM-YYYY.");
    }

    const linkData = await new DynamoService().get(urlCode);

    if (linkData === null) {
        throw createHttpError.BadRequest("Cannot found any information about the url with the incomming code.");
    }

    const listLinkDataClicks = await new DynamoService().getClicks(urlCode, filterDate);

    const response: StatisticsResponse = {
        success: true,
        totalClicks: linkData.totalClicks,
        linkCode: urlCode,
        clicksInfo: listLinkDataClicks,
        totalClicksForCurrentDate: listLinkDataClicks.length
    }

    return {
        statusCode: 200,
        body: JSON.stringify(response),
        headers: {
            "Content-type": "application/json"
        }
    }
}

export const handler = middy<APIGatewayEvent, APIGatewayProxyResult>(
    getStatsByCodeLambda
)
    .use(httpErrorHandler())