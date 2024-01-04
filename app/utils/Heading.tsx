import React, { FC } from "react";

interface HeadProps {
  title: string;
  description: string;
  keywords: string;
}

const Heading: FC<HeadProps> = ({ title, description, keywords }) => {
  return (
    <>
      <title>{title}</title>
      {/* This meta tag is used for responsive web design.
      It sets the viewport width to the device width and initial scale to 1. */}
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      {/* Specifies the meta description for the page, which is often used by search engines. */}
      <meta name="description" content={description} />
      {/* Specifies keywords associated with the page.
      However, note that modern search engines typically don't rely heavily on the meta keywords tag for ranking. */}
      <meta name="keywords" content={keywords} />
    </>
  );
};

export default Heading;
