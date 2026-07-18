import { trpc } from "../lib/trpc";

export default function Newsletter() {
  const join = trpc.waitlist.join.useMutation();

  return (
    <section className="email" id="newsletter">
      <div className="wrap">
        <div className="eyebrow" style={{ textAlign: "center" }}>Stay in the loop</div>
        <h2>Newsletter &amp; email subscriptions</h2>
        <p>New batch results, product launches, and the occasional lunar-cycle reminder. No spam.</p>
        <form
          className="form"
          onSubmit={(e) => {
            e.preventDefault();
            const email = (e.currentTarget.elements.namedItem("email") as HTMLInputElement).value;
            join.mutate({ email });
          }}
        >
          <input type="email" name="email" placeholder="you@email.com" aria-label="Email address" required />
          <button className="btn" type="submit">
            {join.isSuccess ? "Thanks — you're subscribed" : "Subscribe"}
          </button>
        </form>
      </div>
    </section>
  );
}
