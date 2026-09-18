import { Helmet } from "react-helmet-async";
import { useLanguage } from "@/lib/language-context";

const SITE_URL = "https://banglahq.com";

type PublicSeoProps = {
  path: string;
  titleEn: string;
  titleBn: string;
  descriptionEn: string;
  descriptionBn: string;
  jsonLd?: Record<string, unknown>;
};

const englishPath = (path: string) => path === "/" ? "/" : `/${path.replace(/^\/+|\/+$/g, "")}`;
const banglaPath = (path: string) => path === "/" ? "/bn/" : `/bn${englishPath(path)}`;

export default function PublicSeo({
  path,
  titleEn,
  titleBn,
  descriptionEn,
  descriptionBn,
  jsonLd,
}: PublicSeoProps) {
  const { lang } = useLanguage();
  const enUrl = `${SITE_URL}${englishPath(path)}`;
  const bnUrl = `${SITE_URL}${banglaPath(path)}`;
  const canonical = lang === "bn" ? bnUrl : enUrl;
  const title = lang === "bn" ? titleBn : titleEn;
  const description = lang === "bn" ? descriptionBn : descriptionEn;

  return (
    <Helmet htmlAttributes={{ lang: lang === "bn" ? "bn-BD" : "en" }}>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />
      <link rel="alternate" hrefLang="en" href={enUrl} />
      <link rel="alternate" hrefLang="bn-BD" href={bnUrl} />
      <link rel="alternate" hrefLang="x-default" href={enUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonical} />
      <meta property="og:locale" content={lang === "bn" ? "bn_BD" : "en_US"} />
      <meta property="og:locale:alternate" content={lang === "bn" ? "en_US" : "bn_BD"} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {jsonLd && <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>}
    </Helmet>
  );
}