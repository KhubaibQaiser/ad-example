import { ulid as generateUlid } from 'ulidx';

const AFFILIATE_PARAMS_MAP = {
    Awin: {
        params: ['clickref'],
        subParams: '{"clickref2"}',
    },
    CJ: {
        params: ['sid'],
        subParams: '{"aid"}',
    },
    Ebay: {
        params: ['customid'],
        subParams: '{}',
    },
    Impact: {
        params: ['subId1'],
        subParams: '{"subId2"}',
    },
    Partnerize: {
        params: ['pubref'],
        subParams: '{"p_id"}',
    },
    Rakuten: {
        params: ['u1'],
        subParams: '{"subId"}',
    },
    Sovrn: {
        params: ['cuid'],
        subParams: '',
    },
    ShareASale: {
        params: ['afftrack'],
        subParams: '',
    },
    Ascend: {
        params: ['clid'],
        subParams: '{"website"}',
    },
};

export const getTrackingUrl = ({ product }: { product: any }) => {
    const ulid = generateUlid();
    const storeHandle = 'embed'; // store.handle

    const affiliate = product.retailer?.affiliate?.name;
    const params = affiliate ? AFFILIATE_PARAMS_MAP[affiliate as keyof typeof AFFILIATE_PARAMS_MAP]?.params : null;

    if (process.env.NODE_ENV === 'production') {
        return product.non_affiliate_url ? product.non_affiliate_url : product.product_url;
    }

    if (!params || params.length <= 0) {
        return product.product_url;
    }

    const trackingValue = `${ulid}-${storeHandle}`;
    const token = affiliate?.trim().toLowerCase();
    const workingUrl = new URL(product.product_url);
    const trackingParam = params[0];

    switch (token) {
        // TODO: Wait for the PR to be merged: https://github.com/shopsense-ai/citadel/pull/412
        // case 'amazon':
        //   const amazonSearchParams = new URLSearchParams(workingUrl.search);
        //   amazonSearchParams.append('amnz_track', trackingValue);
        //   workingUrl.search = amazonSearchParams.toString();
        //   break;
        case 'partnerize':
            const partnerizePathName = workingUrl.pathname.split('/');
            const locIndex = partnerizePathName.findIndex((el) => el.includes('camref'));

            if (locIndex > 0) {
                // Append tracking id and sub affiliate path params
                partnerizePathName.splice(locIndex + 1, 0, `${trackingParam}:${trackingValue}`);
                workingUrl.pathname = partnerizePathName.join('/');
            }
            break;
        case 'cj':
            const cjSearchParams = new URLSearchParams(workingUrl.search);
            cjSearchParams.append(trackingParam, trackingValue);
            workingUrl.search = cjSearchParams.toString();
            break;
        case 'awin':
            const awinSearchParams = new URLSearchParams(workingUrl.search);
            const newSearchParams = new URLSearchParams();
            awinSearchParams.forEach((value, key) => {
                if (key === 'ued') {
                    // Add the clickref param before 'ued'
                    newSearchParams.append(trackingParam, trackingValue);
                }
                // Add the current param
                newSearchParams.append(key, value);
            });

            if (!awinSearchParams.has('ued')) {
                newSearchParams.append(trackingParam, trackingValue);
            }

            workingUrl.search = newSearchParams.toString();
            break;
        case 'connexity':
            const connexitySearchParams = new URLSearchParams(workingUrl.search);
            const [campaignParam, placementParam, ridParam] = params;

            if (campaignParam) {
                connexitySearchParams.append(campaignParam, storeHandle);
            }

            if (placementParam) {
                connexitySearchParams.append(placementParam, product.collection.handle);
            }

            if (ridParam) {
                // Sanitize for Connexity compliance. Only alphanumeric chars
                const sHandle = storeHandle.replace(/-/g, 'SHDASH');
                const cTracking = `${ulid}TPDASH${sHandle}`;
                connexitySearchParams.append(ridParam, cTracking);
            }
            workingUrl.search = connexitySearchParams.toString();
            break;
        default:
            const searchParams = new URLSearchParams(workingUrl.search);
            searchParams.append(trackingParam, trackingValue);
            workingUrl.search = searchParams.toString();
            break;
    }

    return workingUrl.toString();
};
