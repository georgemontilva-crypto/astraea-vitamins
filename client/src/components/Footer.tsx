import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="site">
      <div className="wrap">
        <div className="grid">
          <div>
            <span className="brand">ASTRAEA</span>
            <p>Supplements you can verify. Every batch independently tested, every result published.</p>
          </div>
          <div>
            <h5>Shop</h5>
            <Link to="/shop?line=Wellness">Wellness</Link>
            <Link to="/shop?line=Sport">Sport</Link>
            <Link to="/shop">All products</Link>
          </div>
          <div>
            <h5>Trust</h5>
            <Link to="/lab-tests">Lab tests</Link>
            <Link to="/lab-tests">How we test</Link>
            <a href="#">Our story</a>
          </div>
          <div>
            <h5>Support</h5>
            <a href="#">Subscriptions</a>
            <a href="#">Shipping</a>
            <a href="#">Contact</a>
          </div>
        </div>
        <div className="base">
          © 2026 ASTRAEA VITAMINS · THESE STATEMENTS HAVE NOT BEEN EVALUATED BY THE FDA · NOT INTENDED TO DIAGNOSE, TREAT, CURE, OR PREVENT ANY DISEASE
        </div>
      </div>
    </footer>
  );
}
