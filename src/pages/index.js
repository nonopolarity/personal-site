import React from 'react';

import Layout from '../components/layout';
import SEO from '../components/seo';

import style from '../styles/post.module.css';

const HomePage = () => (
  <Layout>
    <SEO title="About Chih-Ching" />
    <div className={style.post}>
      <div className={style.postContent}>Hello</div>
    </div>
  </Layout>
);

export default HomePage;
