import React from "react";
import Image from "next/image";
import { Gift } from "./giftlist-utils";

export default function GiftCard({ gift }: { gift: Gift }) {
  return (
    <div className="bg-white dark:bg-[#18181b] rounded-xl shadow-lg p-4 flex flex-col items-center w-80 transition hover:scale-105 hover:shadow-2xl border border-gray-100 dark:border-zinc-800">
      <div className="w-full h-48 flex items-center justify-center mb-4 overflow-hidden rounded-lg bg-gray-50 dark:bg-zinc-900">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={gift.image}
          alt={gift.Objets}
          className="object-contain h-full w-full"
        />
      </div>
      <h2 className="text-lg font-semibold mb-2 text-center">{gift.Objets}</h2>
      <p className="text-blue-600 font-bold text-xl mb-2">{gift.prix} €</p>
      <a
        href={gift.Références}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-auto inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
      >
        Voir le cadeau
      </a>
    </div>
  );
}
