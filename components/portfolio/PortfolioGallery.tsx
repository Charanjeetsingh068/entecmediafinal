import Image from "next/image";

interface PortfolioGalleryProps {
  image: string;
  title: string;
  priority?: boolean;
}

/** A case-study screenshot presented inside the MacBook frame on a dark stage (Kudos style). */
export default function PortfolioGallery({ image, title, priority }: PortfolioGalleryProps) {
  return (
    <figure className="k-detail-stage">
      <div className="macbook-mockup">
        <div className="macbook-bezel">
          <div className="macbook-camera" />
          <div className="macbook-screen">
            <Image src={image} alt={title} fill sizes="(max-width: 1199px) 90vw, 45vw" className="macbook-screenshot" priority={priority} />
          </div>
        </div>
        <div className="macbook-base">
          <div className="macbook-notch" />
        </div>
      </div>
    </figure>
  );
}
