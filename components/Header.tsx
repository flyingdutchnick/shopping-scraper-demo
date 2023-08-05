"use client";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import SearchButton from "./SearchButton";
import { useRouter } from 'next/navigation'

import {
  SearchSelect,
  SearchSelectItem,
  SelectItem,
  Select,
} from "@tremor/react";
import Avatar from "react-avatar";

function Header() {
  const SORT_BY_MAP = {
    r: "Default",
    rv: "By Review",
    p: "By Price",
    pd: "By Price (high to low)",
  };
  const [pages, setPages] = useState("");
  const [sortBy, setSortBy] = useState("r");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const router = useRouter();

  return (
    <header className="flex flex-col items-center md:flex-row md:items-start md:space-x-6 pt-10 pb-5 px-2 md:pb-5">
      <Link href="/">
        <Image
          src="https://links.papareact.com/208"
          alt="Logo"
          width={150}
          height={150}
          className="object-contain mr-10"
        />
      </Link>

      <div className="w-full md:max-w-2xl">
        <form action={formData => {
          const searchTerm = formData.get("searchTerm");

          if(!formData.get("searchTerm")) return;

          const params = new URLSearchParams();

          if(pages) params.set("pages", pages.toString());
          if(sortBy) params.set("sort_by", sortBy.toString());
          if(minPrice) params.set("min_price", minPrice.toString());
          if(maxPrice) params.set("max_price", maxPrice.toString());

          router.push(`/search/${searchTerm}?${params.toString()}`)
        }}>
          <div className="flex items-center gap-2 w-full px-4">
            <div className="flex items-center space-x-2 bg-white shadow-xl rounded-full border-0 px-6 py-4 md:max-w-5xl flex-1">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              <input
                type="text"
                name="searchTerm"
                placeholder="Search..."
                className="outline-none flex-1"
              />
            </div>
            <SearchButton />
          </div>
          <div className="grid grid-cols-2 gap-2 p-4 md:grid-cols-4 max-w-lg md:max-w-none mx-auto items-center">
            <SearchSelect
              className="min-w-4"
              placeholder="# of pages"
              onValueChange={(value) => setPages(value)}
            >
              {[...Array(100)].map((_, item) => (
                <SearchSelectItem key={item} value={(item + 1).toString()}>
                  {(item + 1).toString()} pages
                </SearchSelectItem>
              ))}
            </SearchSelect>
            <Select
              onValueChange={(value) => setSortBy(value)}
              className="min-w-4"
              placeholder="Sort by"
            >
              {Object.entries(SORT_BY_MAP).map(([key, value]) => (
                <SelectItem key={key} value={key}>
                  {value}
                </SelectItem>
              ))}
            </Select>
            <SearchSelect
              onValueChange={(value) => setMinPrice(value)}
              className="min-w-4"
              placeholder="Min Price..."
            >
              {["", "100", "250", "500", "750", "900", "1000+"].map((_, i) => (
                <SearchSelectItem key={i} value={_.toString()}>
                  {i == 0 ? "No minimum" : `$${_.toString()}`}
                </SearchSelectItem>
              ))}
            </SearchSelect>
            <SearchSelect
              onValueChange={(value) => setMaxPrice(value)}
              className="min-w-4"
              placeholder="Max Price..."
            >
              {["", "100", "250", "500", "750", "900", "1000+"].map((_, i) => (
                <SearchSelectItem key={i} value={_.toString()}>
                  {i == 0 ? "No maximum" : `$${_.toString()}`}
                </SearchSelectItem>
              ))}
            </SearchSelect>
          </div>
        </form>
      </div>
      <div className="hidden lg:flex flex-1 justify-end">
        {/* AVATAR */}
        <Avatar name="Nicolaas Koster" round size="50" />
      </div>
    </header>
  );
}

export default Header;
