import { isImage } from "@/generator/utils/generator-utils";
import { supabase } from "@/services";
import { FeatureLookCollectionAdDataType, Product, Retailer } from "@/services/_types";
import { NextRequest, NextResponse } from "next/server";

function getLogoThumbnailUrl(logos: Retailer["logos"]) {
  const darkTheme = logos.find((logo) => {
    return logo.theme === "dark";
  });

  if (darkTheme) {
    return darkTheme.formats[0].src;
  }

  return logos[0].formats[0].src;
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const collectionId = searchParams.get("collection_id");
    const limit = searchParams.get("limit");
    const storeUrl = searchParams.get("store_url");

    if (!Number(collectionId)) {
      return NextResponse.json({ error: "Collection ID is required" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("collection_product")
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
        )`
      )
      .eq("collection_id", Number(collectionId));

    if (error) {
      throw new Error(error.message);
    }

    const products = (data || []) as unknown as { collection: Product["collection"]; product: Product }[];

    const nProducts: FeatureLookCollectionAdDataType["moduleData"][number]["products"] = products
      .map(({ product: p }) => {
        if (!p.retailer || !p.display_name || !p.base_price || !isImage(p.thumbnail_url?.split(".").pop() || "")) {
          return null;
        }
        const nProduct: FeatureLookCollectionAdDataType["moduleData"][number]["products"][number] = {
          id: p.id,
          display_name: p.display_name,
          price: p.sale_price ?? p.base_price,
          base_price: p.base_price,
          discountable: !!p.sale_price,
          url: process.env.ENVIRONMENT === "production" ? p.affiliate_url : p.product_url,
          affiliate_url: p.affiliate_url,
          affiliate: p.retailer?.affiliate?.name,
          product_url: p.product_url,
          non_affiliate_url: p.product_url,
          retailer: {
            id: p.retailer.id,
            retailer_id: p.retailer.retailer_id,
            name: p.retailer.name,
            logos: p.retailer.logos,
            thumbnail_url: getLogoThumbnailUrl(p.retailer.logos),
            affiliate: {
              ...p.retailer.affiliate,
              params: [],
              subParams: [],
            },
          },
          image: p.thumbnail_url,
          thumbnail_url: p.thumbnail_url,
          collection: p.collection,
        };

        return nProduct;
      })
      .filter((p) => p !== null)
      .slice(0, limit ? Number(limit) : 20);

    const title = products[0].collection.name;
    const collectionUrl = `${storeUrl}/collections/${products[0].collection.handle}`;

    const adData: FeatureLookCollectionAdDataType = {
      title,
      collection_handle: title.toLowerCase().replace(/ /g, "-"),
      description: "",
      moduleData: [
        {
          media: "image",
          logoURL: "",
          srcURL: "",
          duration: 5000,
          title: "Module Title",
          products: nProducts,
        },
      ],
      moduleType: "featureLook",
      collection_url: collectionUrl,
      store_handle: "",
      product_base_url: "",
      clickTag: collectionUrl,
    };

    return NextResponse.json({ data: adData, error });
  } catch (error: any) {
    console.error("Error:", error);
    return NextResponse.json({ data: null, error: error?.message }, { status: 500 });
  }
}
