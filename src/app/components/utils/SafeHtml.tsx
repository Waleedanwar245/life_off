'use client';
import React from 'react';

type Props = {
  html: string;
};

const SafeHtml = ({ html }: Props) => {
  return (
    <p
      className="text-gray-500 custom-class"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

export default SafeHtml;
