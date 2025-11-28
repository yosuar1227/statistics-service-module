import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
    DynamoDBDocumentClient,
    GetCommand,
    QueryCommand
} from "@aws-sdk/lib-dynamodb";

export const LINK_CODE_GROUP = 'LINK_CODE';
const LINK_CODE_CLICK = 'LINK_CODE_CLICK';

export class DynamoService {

    private readonly client = DynamoDBDocumentClient.from(
        new DynamoDBClient({}),
        {
            marshallOptions: {
                convertClassInstanceToMap: true,
                removeUndefinedValues: true,
            },
        }
    );

    constructor() { }

    async get(urlCode: string) {
        if (!urlCode.startsWith(LINK_CODE_GROUP)) {
            urlCode = `${LINK_CODE_GROUP}-${urlCode}`
        }

        try {
            const comand = new GetCommand({
                TableName: process.env.ShortLinkTable || "",
                Key: {
                    uuid: urlCode,
                    linkCode: LINK_CODE_GROUP
                },
            });

            const response = await this.client.send(comand);

            return response.Item || null;
        } catch (error) {
            console.error("Error getting the item", error);
            return null;
        }
    }

    async getClicks(urlCode: string, date?: string) {
        try {
            if (!urlCode.startsWith(LINK_CODE_CLICK)) {
                urlCode = `${LINK_CODE_CLICK}-${urlCode}`;
            }

            let filterExpression: string | undefined;
            let expressionAttrNames: Record<string, string> | undefined;
            let extraExpressionValues: Record<string, any> | undefined;

            if (date) {
                filterExpression = "#created = :date";
                expressionAttrNames = { "#created": "created" };
                extraExpressionValues = { ":date": date };
            }

            const baseValues: Record<string, any> = {
                ":e": urlCode
            };

            const finalExpressionValues = extraExpressionValues
                ? { ...baseValues, ...extraExpressionValues }
                : baseValues;

            const command = new QueryCommand({
                TableName: process.env.ShortLinkTable || "",
                IndexName: "ReverseIndex",
                KeyConditionExpression: "linkCode = :e",
                FilterExpression: filterExpression,
                ExpressionAttributeNames: expressionAttrNames,
                ExpressionAttributeValues: finalExpressionValues
            });

            const result = await this.client.send(command);
            return result.Items ?? [];
        } catch (error) {
            console.error("Error getting clicks infoi:::", error)
            return []
        }
    }

}