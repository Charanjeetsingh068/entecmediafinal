/**
 * Client logos for the "Our clients" marquee (services page). Only the logo image is shown; the name is
 * used as its alt text.
 * NOTE: the files in /public/images/clients are placeholder logos. Replace them with the real client
 * logos in their original colours (SVG or transparent PNG — they sit on white tiles); keep the same file
 * names or update `logo` here.
 */
export interface Client {
  name: string;
  logo: string;
}

export const clients: Client[] = [
  { name: "NexaTech", logo: "/images/clients/nexatech.svg" },
  { name: "Lumina Studios", logo: "/images/clients/lumina-studios.svg" },
  { name: "Apex Retail", logo: "/images/clients/apex-retail.svg" },
  { name: "CyberShield", logo: "/images/clients/cybershield.svg" },
  { name: "Velocity", logo: "/images/clients/velocity.svg" },
  { name: "Hyperion Cloud", logo: "/images/clients/hyperion-cloud.svg" },
  { name: "GreenLeaf", logo: "/images/clients/greenleaf.svg" },
  { name: "UrbanNest", logo: "/images/clients/urbannest.svg" },
  { name: "SmileCare", logo: "/images/clients/smilecare.svg" },
  { name: "TasteBox", logo: "/images/clients/tastebox.svg" },
  { name: "BlueWave", logo: "/images/clients/bluewave.svg" },
  { name: "PureDrop", logo: "/images/clients/puredrop.svg" },
];
