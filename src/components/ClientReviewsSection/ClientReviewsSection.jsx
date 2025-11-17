import ClientReviews from "@/components/ClientReviews/ClientReviews";

export default function ClientReviewsSection() {
  return (
    <section className="client-reviews-container">
      <div className="container">
        <div className="client-reviews-header-callout">
          <p>Voices from our spaces</p>
        </div>
        <ClientReviews />
      </div>
    </section>
  );
}
