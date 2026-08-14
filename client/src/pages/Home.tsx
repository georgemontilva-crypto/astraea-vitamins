import { Link } from "react-router-dom";
import ParticleBackground from "../components/ParticleBackground";
import ProductCarousel from "../components/ProductCarousel";
import { trpc } from "../lib/trpc";

export default function Home() {
  const { data: products } = trpc.products.list.useQuery();
  const { data: heroBg } = trpc.settings.get.useQuery("home_hero_bg");
  const essentials = products?.slice(0, 4) ?? [];

  return (
    <div>
      <header
        className="hero"
        style={
          heroBg
            ? { backgroundImage: `linear-gradient(rgba(14,27,46,.75), rgba(14,27,46,.85)), url(${heroBg})`, backgroundSize: "cover", backgroundPosition: "center" }
            : undefined
        }
      >
        <ParticleBackground color="169, 192, 216" className="particles" />
        <div className="wrap">
          <div className="eyebrow">37 supplements · every batch tested</div>
          <h1>We don't ask you to trust us. We show you.</h1>
          <p className="sub">
            Every Astraea batch is tested by an independent lab, and every bottle carries a code
            to its actual results. No proprietary blends. No hidden fillers. Nothing you can't check.
          </p>
          <div className="cta">
            <Link className="btn" to="/shop">Shop Collection</Link>
            <Link className="btn ghost" to="/lab-tests">View Lab Results</Link>
          </div>
          <div className="proofstrip">
            <span className="dot" />
            VIEW LAB RESULTS · EVERY BATCH, INDEPENDENTLY TESTED · SCAN FOR RESULTS
          </div>
        </div>
      </header>

      <section className="promise">
        <div className="wrap">
          <div className="cols">
            <div>
              <div className="eyebrow">The problem we exist for</div>
              <h2>The supplement aisle asks for your trust and shows you nothing.</h2>
            </div>
            <div>
              <p>
                Proprietary blends hide doses. Labels don't always match what's inside.
                "Third-party tested" gets printed on bottles with nothing behind it. Astraea was
                built to end the guessing: we publish the actual lab results for the actual batch
                in your hand.
              </p>
              <div className="stat">
                <div className="n">Launching soon</div>
                <div className="l">every batch tested &amp; published before it ships</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="how">
        <div className="wrap">
          <div className="eyebrow">How it works</div>
          <h2 className="heading">Proof in three steps.</h2>
          <div className="steps">
            <div className="step">
              <div className="num">STEP 01</div>
              <h3>Scan the bottle</h3>
              <p>Every Astraea package has a QR code on the front. One scan opens that product's lab page. No app, no account.</p>
              <div className="scanvis">
                <div className="qr" />
                <div className="vt">CHECK THE<br />TESTING</div>
              </div>
            </div>
            <div className="step">
              <div className="num">STEP 02</div>
              <h3>Find your batch</h3>
              <p>Match the lot number on your pack. You'll see exactly what was tested in the batch you're holding, not a generic sample.</p>
            </div>
            <div className="step">
              <div className="num">STEP 03</div>
              <h3>Read the results</h3>
              <p>Every panel, pass or fail, with the label claim next to the tested value, and the full certificate to download.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="sec">
        <div className="wrap">
          <div className="head">
            <div>
              <div className="eyebrow">Start here</div>
              <h2>The essentials</h2>
            </div>
            <Link to="/shop">View all 37 →</Link>
          </div>
          <ProductCarousel products={essentials} />
        </div>
      </section>

      <section className="sec" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="lines">
            <div className="lineblk w">
              <div className="k">Wellness</div>
              <h3>For the daily foundation</h3>
              <p>Multivitamins, minerals, and single-ingredient capsules in forms your body can actually use.</p>
              <Link to="/wellness">Shop Wellness</Link>
            </div>
            <div className="lineblk s">
              <div className="k">Sport</div>
              <h3>For the work you put in</h3>
              <p>Creatine, protein, and pre-workout. Tested for what's in them, and what isn't.</p>
              <Link to="/sport">Shop Sport</Link>
            </div>
          </div>
        </div>
      </section>

      <TestBand />

    </div>
  );
}

function TestBand() {
  const { data: bgUrl } = trpc.settings.get.useQuery("home_testband_bg");
  const { data: sideImg } = trpc.settings.get.useQuery("home_testband_side_img");
  const { data: featured, isLoading } = trpc.labTests.featured.useQuery();

  return (
    <section
      className="testband"
      style={
        bgUrl
          ? {
              backgroundImage: `linear-gradient(rgba(14,27,46,.82), rgba(14,27,46,.88)), url(${bgUrl})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }
          : undefined
      }
    >
      <div className="wrap">
        <div className="testband-cols">
          <div>
            <div className="eyebrow">Why one code, and why it never changes</div>
            <h2>The QR on every bottle shows every batch, so we can't hand-pick a flattering one.</h2>
            <p>
              Our testing is done by an independent, ISO 17025-accredited lab. We don't own it, and
              we don't pay it based on results. If a batch fails, it doesn't ship, and its lot number
              is retired. That's the whole promise, and you can check it any time.
            </p>
            {!isLoading && (
              <div className="mini">
                <div
                  className="qr"
                  style={{
                    outlineColor: "var(--star)",
                    background:
                      "conic-gradient(var(--star) 0 25%,transparent 0 50%,var(--star) 0 75%,transparent 0) 0 0/15px 15px,var(--ink2)",
                  }}
                />
                {featured ? (
                  <div>
                    <div className="b">{featured.productName.toUpperCase()} · LOT {featured.lot}</div>
                    <div className="r">
                      {featured.panelCount} OF {featured.panelCount} PANELS · {featured.allPass ? "PASS" : "SEE FULL REPORT"}
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="b">LAB RESULTS COMING AT LAUNCH</div>
                    <div className="r">
                      Every batch is tested before it ships. Results publish here as soon as the first
                      lots clear the lab.
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          <div
            className="testband-side-img"
            style={
              sideImg
                ? { backgroundImage: `url(${sideImg})`, backgroundSize: "cover", backgroundPosition: "center" }
                : undefined
            }
          />
        </div>
      </div>
    </section>
  );
}


