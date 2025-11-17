import Copy from "@/components/Copy/Copy";
import FeaturedProjects from "@/components/FeaturedProjects/FeaturedProjects";

export default function FeaturedProjectsSection() {
  return (
    <section className="featured-projects-container">
      <div className="container">
        <div className="featured-projects-header-callout">
          <Copy delay={0.1}>
            <p>Featured work</p>
          </Copy>
        </div>
        <div className="featured-projects-header">
          <Copy delay={0.15}>
            <h2>A selection of recent studies and completed spaces</h2>
          </Copy>
        </div>
      </div>
      <FeaturedProjects />
    </section>
  );
}
