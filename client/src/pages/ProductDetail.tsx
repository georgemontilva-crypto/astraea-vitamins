import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import BottleArt from "../components/BottleArt";
import { trpc } from "../lib/trpc";
import { useCart } from "../contexts/CartContext";

type SupplementFact = { name: string; amount: string; unit?: string; dv?: string };

export default function ProductDetail() {
  const { handle } = useParams();
  const { data: product, isLoading } = trpc.products.byHandle.useQuery(handle!, { enabled: !!handle });
  const [mode, setMode] = useState<"subscribe" | "one_time">("subscribe");
  const { addItem } = useCart();

  if (isLoading) return <p style={{ padding: 48 }}>Loading…</p>;
  if (!product) return <p style={{ padding: 48 }}>Producto no encontrado.</p>;

  const facts = (product.supplementFacts as SupplementFact[] | null) ?? [];
  const freeFrom = (product.freeFromTags ?? "")
    .split("|")
    .map((t) => t.trim())
    .filter(Boolean);
  const lineClass = product.line === "Wellness" ? "wellness-c" : "sport-c";
  const rawPrice = mode === "subscribe" ? product.priceSubscribe : product.priceOneTime;
  const priceOneTime = product.priceOneTime ? `$${product.priceOneTime}` : "Price TBD";
  const priceSubscribe = product.priceSubscribe ? `$${product.priceSubscribe}` : "Price TBD";

  function handleAddToCart() {
    if (!product) return;
    addItem({
      productId: product.id,
      productName: product.name,
      unitPrice: rawPrice ? parseFloat(rawPrice) : 0,
      priceKnown: !!rawPrice,
      quantity: 1,
      image: product.imageUrl ?? undefined,
      handle: product.handle,
      mode,
    });
  }

  return (
    <section className={`pdp ${lineClass}`}>
      <div className="wrap">
        <Link className="back" to="/shop">← Back to shop</Link>
        <div className="top">
          <div className="gallery">
            <BottleArt name={product.name} line={product.line} format={product.format} big />
          </div>
          <div className="detail">
            <span className="ptag">{product.line}</span>
            <h1>{product.name}</h1>
            <div className="dose">{product.servingSupply}</div>
            <p className="blurb">{product.blurb}</p>
            <div className="price">{mode === "subscribe" ? priceSubscribe : priceOneTime}</div>

            <div className="buy">
              <div className={`buyopt ${mode === "subscribe" ? "on" : ""}`} onClick={() => setMode("subscribe")}>
                <div className="radio" />
                <div className="t">
                  <b>Subscribe · every 28 days</b>
                  <br />
                  <span>One lunar cycle. Skip or cancel anytime.</span>
                </div>
                <span className="save">SAVE 15%</span>
              </div>
              <div className={`buyopt ${mode === "one_time" ? "on" : ""}`} onClick={() => setMode("one_time")}>
                <div className="radio" />
                <div className="t">
                  <b>One-time purchase</b>
                  <br />
                  <span>{priceOneTime}</span>
                </div>
              </div>
            </div>

            <button className="addcart" onClick={handleAddToCart}>
              Add to cart
            </button>
            <Link className="checktest" to={`/lab-tests?product=${product.handle}`}>
              Check this product's testing →
            </Link>

            <div className="info">
              <div className="infogrid">
                <div className="infocard">
                  <h4>Supplement Facts</h4>
                  <div className="factbox">
                    <h4>Supplement Facts</h4>
                    <div className="sv">{product.servingSupply}</div>
                    {facts.length > 0 ? (
                      <table>
                        <tbody>
                          {facts.map((f, i) => (
                            <tr key={i}>
                              <td>{f.name}</td>
                              <td className="r">{f.amount}{f.unit ?? ""}{f.dv ? ` · ${f.dv}` : ""}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <p style={{ fontSize: 11, padding: "8px 0" }}>
                        Full facts pending regulatory sign-off. See the label artwork
                        (design-reference/labels) for this SKU's real values.
                      </p>
                    )}
                    <div className="fine">Full disclosure. No proprietary blends.</div>
                  </div>
                </div>
                <div className="infocard">
                  <h4>Why this form</h4>
                  <p>{product.whyThisForm || "—"}</p>
                  {freeFrom.length > 0 && (
                    <>
                      <h4 style={{ marginTop: 22 }}>Free from</h4>
                      <div className="freefrom">
                        {freeFrom.map((tag) => (
                          <span key={tag}>{tag}</span>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="reviews">
          <div className="head" style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <h2 style={{ fontFamily: "Marcellus,serif", fontWeight: 400, fontSize: 24 }}>What people say</h2>
          </div>
          <p style={{ color: "var(--muted)", fontSize: 14, marginTop: 12 }}>
            No verified reviews yet for this product. Per the brand guide, reviews here must be
            genuine, verified-buyer submissions. Nothing gets fabricated.
          </p>
        </div>
      </div>
    </section>
  );
}
