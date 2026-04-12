import { Helmet } from 'react-helmet-async';
import favicon from '../assets/images/studyjuche - logo - 50h.png';

interface SiteHeaderProps {
  title?: string;
  description?: string;
  url?: string;
}

export default function SiteHeader({ title, description, url }: SiteHeaderProps) {
    const siteName = "Study Juche";
    const fullTitle = title ? `${title} | ${siteName}` : siteName;

    return (
        <Helmet>
            <meta charSet="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <link rel="icon" type="image/png" href={favicon} />

            <title>{fullTitle}</title>
            <meta name="description" content={description || "Study Juche"} />

            <meta property="og:title" content={fullTitle} />
            <meta property="og:type" content="website" />
            <meta property="og:url" content={url || "https://juche.study"} />
        </Helmet>
    );
}
