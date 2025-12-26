import React, { useMemo } from "react";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

export default function ProductCherche() {
  const { search } = useLocation();
  const q = new URLSearchParams(search).get("q") || "";

  // 🔁 adapte selon ton store
  const products = useSelector((state) => state.products?.items || []);

  const results = useMemo(() => {
    const query = q.toLowerCase().trim();
    if (!query) return [];
    return products.filter((p) =>
      (p.title || p.name || "").toLowerCase().includes(query)
    );
  }, [q, products]);

  return (
    <div className="px-10 py-8">
      <h2 className="text-2xl font-bold">
        Résultats pour : <span className="text-gray-600">"{q}"</span>
      </h2>

      <p className="text-gray-500 mt-2">{results.length} produit(s)</p>

      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-6">
        {results.map((p) => (
          <div key={p.id} className="border rounded-xl p-4">
            <img src={p.image} alt={p.title} className="h-40 w-full object-cover rounded-lg" />
            <h3 className="mt-2 font-semibold">{p.title}</h3>
            <p className="font-bold">{p.price} DH</p>
          </div>
        ))}
      </div>
    </div>
  );
}
