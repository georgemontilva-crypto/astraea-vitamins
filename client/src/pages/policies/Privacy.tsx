import PolicyLayout from "../../components/PolicyLayout";

export default function Privacy() {
  return (
    <PolicyLayout title="Privacy Policy">
      <p>
        A full privacy policy — what data we collect (account info, order history, contact form
        submissions), how it's stored, and how to request deletion — needs a real legal pass before
        publishing.
      </p>
      <p style={{ marginTop: 14 }}>
        What's true today: account passwords are hashed, never stored in plain text; session data
        lives in an httpOnly cookie; we don't sell data to third parties.
      </p>
    </PolicyLayout>
  );
}
