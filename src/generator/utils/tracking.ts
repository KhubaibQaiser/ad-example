import { Product } from '@/services/_types';
import { ulid as generateUlid } from 'ulidx';

export const getTrackingUrl = ({ product }: { product: Product }) => {
  const ulid = generateUlid();
  const storeHandle = 'embed'; // store.handle

  const affiliate = product.retailer.affiliate?.name;
  const params = product.retailer.affiliate?.params;

  if (process.env.ENVIRONMENT !== 'production') {
    return product.non_affiliate_url ? product.non_affiliate_url : product.url;
  }

  if (!params || params.length <= 0) {
    return product.url;
  }

  const trackingValue = `${ulid}-${storeHandle}`;
  const token = affiliate?.trim().toLowerCase();
  const workingUrl = new URL(product.url);
  const trackingParam = params[0];

  switch (token) {
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
        const sHandle = storeHandle.replaceAll('-', 'SHDASH');
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
