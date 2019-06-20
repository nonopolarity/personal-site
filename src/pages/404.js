import React from 'react';

import Layout from '../components/layout';
import SEO from '../components/seo';

import style from '../styles/notFound.module.css';

const imgSource =
  'https://images.unsplash.com/photo-1498857127156-d2943a73f456' +
  '?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1500&q=80';
const imgDownload =
  'https://unsplash.com/photos/Bs0zgYkYEZw/download?force=true';

const NotFoundPage = () => (
  <Layout>
    <SEO title="404: Not found" />
    <h1>NOT FOUND</h1>
    <a
      className={style.link}
      download="getLost.jpg"
      href={imgDownload}
      title="Lost"
    >
      <img src={imgSource} alt="404-not-found-get-lost" />
      <p className={style.creditTxt}>
        Photo Credit:
        <a href="https://unsplash.com/@natalie_rhea">Natalie Rhea Riggs</a>
      </p>
    </a>
    <h3>Oops, seems like you get lost in the middle of nowhere. :(</h3>
  </Layout>
);

export default NotFoundPage;
