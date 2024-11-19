import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import * as multipart from 'aws-lambda-multipart-parser';
import { EmbedGeneratorPayload, GeneratorEventPayload, GeneratorProduct, Product } from '../shared/types';
import { getLogoThumbnailUrl, isImage, readFileAsString } from '../shared/utils';
import { supabase } from './supabase-client';
import { getTrackingUrl } from './tracking.utils';

export const getCollectionDataForGenerator = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    // Parse the FormData payload
    const parsedData = multipart.parse(event, true) as GeneratorEventPayload;

    const collection_id = Number(parsedData.collection_id);
    const store_url = parsedData.store_url;
    const limit_products = Number(parsedData.limit_products);
    const template = parsedData.template;
    const template_logo = await readFileAsString(parsedData.template_logo);
    const template_title = parsedData.template_title;
    const template_subtitle = parsedData.template_subtitle;
    const template_width = parsedData.template_width;
    const template_height = parsedData.template_height;
    const embed_id = parsedData.embed_id || '';
    const campaign_id = parsedData.campaign_id || '';
    const utm_config = JSON.parse(parsedData.utm_config);

    if (!collection_id || !store_url || !limit_products || !template) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: 'Invalid request body' }),
        };
    }

    const { data, error } = await supabase
        .from('collection_product')
        .select(
            `
        collection (
          id,
          handle,
          display_name,
          name
        ),
        product (
          id,
          display_name,
          base_price,
          sale_price,
          thumbnail_url,
          handle,
          product_url,
          affiliate_url,
          kirby_id,
          retailer (
            id,
            retailer_id,
            name,
            logos,
            affiliate (
              name,
              handle
            )
          )
        )`,
        )
        .eq('collection_id', Number(collection_id));

    if (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error }),
        };
    }

    const products = (data || []) as unknown as { collection: Product['collection']; product: Product }[];

    const nProducts: GeneratorProduct[] = products
        .map(({ product: p }) => {
            if (!p.retailer || !p.display_name || !p.base_price || !isImage(p.thumbnail_url?.split('.').pop() || '')) {
                return null;
            }
            const nProduct: GeneratorProduct = {
                id: p.id,
                display_name: p.display_name,
                sale_price: p.sale_price,
                base_price: p.base_price,
                discountable: !!p.sale_price,
                product_url: process.env.NODE_ENV === 'production' ? p.affiliate_url : p.product_url,
                affiliate_url: p.affiliate_url,
                retailer: {
                    id: p.retailer.id,
                    retailer_id: p.retailer.retailer_id,
                    name: p.retailer.name,
                    thumbnail_url: getLogoThumbnailUrl(p.retailer.logos),
                    affiliate: {
                        ...p.retailer.affiliate,
                        params: [],
                        subParams: [],
                    },
                },
                thumbnail_url: p.thumbnail_url,
                collection: p.collection,
                ad_click_event_tracking_id: '',
            };

            nProduct.ad_click_event_tracking_id = getTrackingUrl({ product: nProduct });
            return nProduct;
        })
        .filter((p) => p !== null)
        .slice(0, limit_products ? Number(limit_products) : 20) as GeneratorProduct[];

    const title = products[0].collection.name;
    const collectionUrl = `${store_url}/collections/${products[0].collection.handle}`;

    const adData: EmbedGeneratorPayload = {
        title,
        collection_handle: collectionUrl,
        image_url: '',
        modules: [
            {
                media: 'image',
                srcURL: '',
                products: nProducts,
            },
        ],
        collection_id: collection_id,
        meta: {
            title: template_title,
            subtitle: template_subtitle,
            logo: template_logo,
            clickTag: collectionUrl,
            width: template_width,
            height: template_height,
            tracking: {
                embed_id,
                campaign_id,
                utms: utm_config,
            },
        },
    };

    return {
        statusCode: 200,
        body: JSON.stringify(adData),
    };
};
