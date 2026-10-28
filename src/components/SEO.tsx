import React from 'react';
import { Helmet } from 'react-helmet-async';

export interface SEOProps {
  title: string;
  description?: string;
  keywords?: string;
  type?: 'website' | 'article';
}

const DEFAULT_DESCRIPTION =
  'HospiScholar is the all-in-one academic and professional learning platform for hotel management, culinary arts, and hospitality students.';

export const SEO: React.FC<SEOProps> = ({
  title,
  description = DEFAULT_DESCRIPTION,
  keywords = 'hospitality, hotel management, NCHMCT, culinary arts, food production, F&B service, front office, housekeeping',
  type = 'website'
}) => {
  // Normalize title: Ensure HospiScholar brand suffix is present if not already appended
  const fullTitle = title.includes('HospiScholar') ? title : `${title} | HospiScholar`;

  return (
    <Helmet>
      {/* Primary HTML Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:site_name" content="HospiScholar" />

      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
    </Helmet>
  );
};
