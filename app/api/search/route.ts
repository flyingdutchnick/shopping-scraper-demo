import { NextResponse } from "next/server";
import { PageResult, SearchParams } from "@/typings";

export async function POST(request: Request) {
  const { searchTerm, pages, ...params } = await request.json();
  const searchParams: SearchParams = params;

  if (!searchTerm) {
    return NextResponse.next(
      new Response("missing search term", {
        status: 400,
      })
    );
  }
  const filters: any = [];

  Object.entries(searchParams).forEach(([key, value]) => {
    if (value) {
      if (key == "max_price") {
        if ((value = "1000+")) return;
      }
      filters.push({
        key,
        value: key === "sort_by" ? value : Number(value),
      });
    }
  });

  const response = await fetch("https://realtime.oxylabs.io/v1/queries", {
    method: "POST",
    headers: {
      "Content-Type": "applications/json",
      Authorization: `Basic ${Buffer.from(
        process.env.OXYLABS_USERNAME + ":" + process.env.OXYLABS_PASSWORD
      ).toString("base64")},`,
    },
    cache: "no-store",
    body: JSON.stringify({
      source: "google_shopping_search",
      domain: "com",
      query: searchTerm,
      pages: Number(pages) || 1,
      context: filters,
      parse: true,
    }),
  });

  const data = await response.json();
  console.log(data)
  const pageResults: PageResult[] = data.results;

  return NextResponse.json(pageResults);
}
