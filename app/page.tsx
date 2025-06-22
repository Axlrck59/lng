import { getGifts } from "./giftlist-utils";
import GiftCard from "./GiftCard";

export default function Home() {
  const gifts = getGifts();
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100 dark:from-zinc-900 dark:to-zinc-800 p-8">
      <h1 className="text-3xl font-bold text-center mb-10 text-blue-700 dark:text-cyan-300">
        Liste de naissance
      </h1>
      <div className="flex flex-wrap justify-center gap-8">
        {gifts.map((gift, idx) => (
          <GiftCard key={idx} gift={gift} />
        ))}
      </div>
    </div>
  );
}
