import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { getCollectionDataForGenerator } from './get-generator-data';
import { generateEmbed } from './generate-embed/generate-embed';
import { EmbedGeneratorPayload } from './shared/types';

/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 *
 */

export const lambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const generatorDataResponse = await getCollectionDataForGenerator(event);

    // return generatorDataResponse;
    if (generatorDataResponse.statusCode !== 200) {
        return generatorDataResponse;
    }

    const generatorData = JSON.parse(generatorDataResponse.body) as EmbedGeneratorPayload;
    const generateEmbedResponse = await generateEmbed([generatorData], 'CbsSportsVerticalTemplate', 300, 300);

    if (!generateEmbedResponse || generateEmbedResponse.length === 0) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: 'Error generating embed' }),
        };
    }

    console.log('generateEmbedResponse', generateEmbedResponse);

    return {
        statusCode: 200,
        body: JSON.stringify(generateEmbedResponse),
    };
};
