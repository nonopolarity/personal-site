import React from 'react';

import Layout from '../components/layout';
import SEO from '../components/seo';

const imgSource =
  'https://images.unsplash.com/photo-1498857127156-d2943a73f456'+
  '?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1500&q=80';
const imgDownload =
  'https://unsplash.com/photos/Bs0zgYkYEZw/download?force=true';

const NotFoundPage = () => (
  <Layout>
    <SEO title="404: Not found" />
    <h1>NOT FOUND</h1>
    <a
      style={{
        boxShadow: `none`,
        textDecoration: `none`,
        color: `inherit`,
        position: 'relative',
      }}
      download="getLost.jpg"
      href={imgDownload}
      title="Lost"
    >
      <img src={imgSource} alt="404-not-found-get-lost" />
      <p
        style={{
          fontSize: 'xx-small',
          position: 'absolute',
          bottom: '8px',
          right: '16px',
          color: 'white',
        }}
      >
        Photo Credit:
        <a
          style={{
            boxShadow: `none`,
            textDecoration: `none`,
            color: `inherit`,
            paddingLeft: '8px',
          }}
          href="https://unsplash.com/@natalie_rhea"
        >
          Natalie Rhea Riggs
        </a>
      </p>
    </a>
    <div style={{ marginBottom: 16 }}>
      Oops, seems like you get lost in the middle of nowhere. :(
    </div>
  </Layout>
);

export default NotFoundPage;
