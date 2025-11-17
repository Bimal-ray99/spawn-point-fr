import Copy from "@/components/Copy/Copy";
import AnimatedButton from "@/components/AnimatedButton/AnimatedButton";

export default function GalleryCallout() {
  return (
    <section className="gallery-callout">
      <div className="container">
        <div className="gallery-callout-col">
          <div className="gallery-callout-row">
            <div className="gallery-callout-img gallery-callout-img-1">
              <img src="/gallery-callout/gallery-callout-1.jpg" alt="" />
            </div>
            <div className="gallery-callout-img gallery-callout-img-2">
              <img src="/gallery-callout/gallery-callout-2.jpg" alt="" />
              <div className="gallery-callout-img-content">
                <h3>800+</h3>
                <p>Project Images</p>
              </div>
            </div>
          </div>
          <div className="gallery-callout-row">
            <div className="gallery-callout-img gallery-callout-img-3">
              <img src="/gallery-callout/gallery-callout-3.jpg" alt="" />
            </div>
            <div className="gallery-callout-img gallery-callout-img-4">
              <img src="/gallery-callout/gallery-callout-4.jpg" alt="" />
            </div>
          </div>
        </div>
        <div className="gallery-callout-col">
          <div className="gallery-callout-copy">
            <Copy delay={0.1}>
              <h3>
                Take a closer look at the projects that define our practice.
                From intimate interiors to expansive landscapes, each image
                highlights a unique perspective that might spark your next big
                idea.
              </h3>
            </Copy>
            <AnimatedButton label="Explore Gallery" route="blueprints" />
          </div>
        </div>
      </div>
    </section>
  );
}
