import { ParsedFile, Retailer } from './types';

export function getLogoThumbnailUrl(logos: Retailer['logos']) {
    const darkTheme = logos.find((logo) => {
        return logo.theme === 'dark';
    });

    if (darkTheme) {
        return darkTheme.formats[0].src;
    }

    return logos[0].formats[0].src;
}

export const formatPrice = (price: string, hasDecimals = false, currency = 'USD') => {
    return parseFloat(price).toLocaleString('en-US', {
        style: 'currency',
        currency,
        minimumFractionDigits: +price >= 100 && !hasDecimals ? 0 : 2,
        maximumFractionDigits: +price >= 100 && !hasDecimals ? 0 : 2,
    });
};

export const getDiscountPercentage = (base_price: string, price: string) => {
    return (((parseFloat(base_price) - parseFloat(price)) / parseFloat(base_price)) * 100).toFixed();
};

export const showDiscount = (discountable: boolean, discountPercentage: string) => {
    return discountable && discountPercentage !== '0';
};

export function isImage(ext: string) {
    return ['.jpg', '.jpeg', '.png', '.webp', '.tiff', '.svg', 'avif'].includes(ext.startsWith('.') ? ext : `.${ext}`);
}

export function isVideo(ext: string) {
    return ['.avi', '.mov', '.mp4', '.m4v', '.mpeg', '.mpg', '.webm', '.wmv'].includes(
        ext.startsWith('.') ? ext : `.${ext}`,
    );
}

export async function readFileAsString(file: ParsedFile): Promise<string> {
    try {
        return Buffer.from(file.content).toString('utf-8');
    } catch (error) {
        console.error(`Error reading file:`, error);
        return '';
    }
}
