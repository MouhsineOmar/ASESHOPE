from fastapi import FastAPI, Depends, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import text

from db import get_db

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/products/search")
def search_products(q: str = Query(..., min_length=1), db: Session = Depends(get_db)):
    query = f"%{q.strip()}%"

    sql = text("""
        SELECT
          p.id,
          p.name,
          p.slug,
          p.price,
          COALESCE(pr.url, '') AS image
        FROM products p
        LEFT JOIN LATERAL (
          SELECT url
          FROM product_resources
          WHERE product_id = p.id
          ORDER BY is_primary DESC
          LIMIT 1
        ) pr ON true
        WHERE
          p.name ILIKE :query
          OR p.brand ILIKE :query
          OR COALESCE(p.description, '') ILIKE :query
        ORDER BY p.created_at DESC
        LIMIT 40;
    """)

    rows = db.execute(sql, {"query": query}).mappings().all()

    items = [
        {"id": r["id"], "title": r["name"], "slug": r["slug"], "price": float(r["price"]), "image": r["image"]}
        for r in rows
    ]

    return {"query": q, "count": len(items), "items": items}
