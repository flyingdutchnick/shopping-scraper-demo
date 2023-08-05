/* eslint-disable @next/next/no-img-element */
import { getFetchUrl } from "@/lib/getFetchUrl";
import { ProductData } from "@/typings";
import { StarIcon } from "@heroicons/react/24/solid";
import { notFound } from "next/navigation";

export const revalidate = 3000;

type Props = {
  params: {
    id: string;
  };
};

async function ProductPage({ params: { id } }: Props) {
  const response = await fetch(getFetchUrl(`api/shopping/product/${id}`));

  const productData = (await response.json()) as ProductData;

  if (!productData.content.pricing) {
    console.log('product content pricing', productData.content.pricing)
    notFound();
  }

  return (
    <div className="p-12 pt-0">
      <h1 className="text-2xl">{productData.content.title}</h1>

      {productData.content.reviews && (
        <div className="flex space-x-1">
          {[
            ...Array.from({
              length: Math.round(productData.content.reviews.rating),
            }),
          ].map((_, i) => (
            <StarIcon key={i} className="h-5 w-5 text-yellow-500" />
          ))}

          {/* show remaining stars from review out of 5 */}
          {[
            ...Array.from({
              length: 5 - Math.round(productData.content.reviews.rating),
            }),
          ].map((_, i) => (
            <StarIcon key={i} className="h-5 w-5 text-gray-200" />
          ))}
        </div>
      )}

      <section className="flex flex-col lg:flex-row space-y-4 mt-4">
        <div className="md:p-10 md:pl-0 mx-auto">
          <div className="flex gap-4">
            <img
              className="h-80 w-80 p-5 border rounded-md object-contain"
              src={productData.content.images?.full_size[0]}
              alt=""
            />
            <div>
              {productData.content.images?.full_size
                .slice(1, 3)
                .map((image, id) => (
                  <img
                    src={image}
                    key={id}
                    alt=""
                    className="w-[9.5rem] h-[9.5rem] object-contain border rounded-md"
                  />
                ))}
            </div>
          </div>
          <div className="flex space-x-6 overflow-x-scroll py-2 md:w-[30rem]">
            {productData.content.images?.full_size.slice(3).map((image, id) => (
              <img
                src={image}
                key={id}
                alt=""
                className="w-20 h-20 object-contain"
              />
            ))}
          </div>
        </div>
        <div className="pt-10 flex-1">
          <div>
            {productData.content.pricing.online[0].details && (
              <>
                <h3 className="font-bold text-2xl">Product details</h3>
                <p className="text-lg">
                  {productData.content.pricing.online[0].price_total}
                  {productData.content.pricing.online[0].currency}
                </p>

                <div className="flex space-x-4">
                  <p className="text-sm text-gray-600">
                    ({productData.content.pricing.online[0].price}{" "}
                    {productData.content.pricing.online[0].currency} +{" "}
                    {productData.content.pricing.online[0].price_tax}{" "}
                    {productData.content.pricing.online[0].currency} tax)
                  </p>
                  {productData.content.pricing.online.length > 1 && (
                    <p className="text-sm text-blue-600">
                      + {productData.content.pricing.online.length - 1} more
                      prices
                    </p>
                  )}
                </div>
                <p className="text-sm text-gray-600 mt-5">
                  {productData.content.pricing.online[0].details}
                </p>
              </>
            )}
            <hr className="my-5" />
            <p>{productData.content.description}</p>
            {productData.content.highlights && (
              <div className="mt-5 space-y-2">
                <h3 className="font-bold text-2xl">Product Highlights</h3>
                <hr />
                <ul className="space-y-2">
                  {productData.content.highlights.map((highlight, id) => (
                    <li className="list-disc" key={id}>
                      {highlight}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </section>
      <section>
        <hr className="my-10" />
        {productData.content.reviews ? (
          <>
            <h3 className="font-bold text-2xl">Reviews</h3>
            <h4 className="text-lg italic">Top review</h4>
            {productData.content.reviews.top_review && (
              <div className="border p-5 rounded-lg mt-2">
                <div className="flex space-x-1">
                  <p className="font-bold capitalize">
                    {productData.content.reviews.top_review.author} says:
                  </p>
                  <h5>{productData.content.reviews.top_review.title}</h5>
                </div>
                <div className="flex space-x-1 mb-2">
                  {[
                    ...Array.from({
                      length: Math.round(
                        productData.content.reviews.top_review.rating
                      ),
                    }),
                  ].map((_, i) => (
                    <StarIcon key={i} className="h-5 w-5 text-yellow-500" />
                  ))}
                </div>
                <p>&quot;{productData.content.reviews.top_review.text}&quot;</p>
              </div>
            )}
          </>
        ) : (
          <div>
            <h3 className="font-bold text-2xl">Reviews</h3>
            <h4 className="text-lg italic">No reviews yet...</h4>
          </div>
        )}
      </section>
      {productData.content.specifications && (
        <section>
          <hr className="my-10" />
          <h3 className="font-bold text-2xl">Specifications</h3>
          {productData.content.specifications.map((specification, id) => (
            <div key={id} className="text-sm">
              <h4 className="font-bold my-2 text-xl">
                {" "}
                {specification.section_title}{" "}
              </h4>
              {specification.items.map((item, id) => (
                <div key={item.title} className="text-sm">
                  <h5 className="font-bold">{item.title}</h5>
                  <p>{item.value}</p>
                </div>
              ))}
            </div>
          ))}
        </section>
      )}
    </div>
  );
}

export default ProductPage;
