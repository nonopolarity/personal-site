import React from 'react';
import Layout from '../components/layout';
import SEO from '../components/seo';
import style from '../styles/post.module.css';

const AboutPage = () => (
  <Layout>
    <SEO title="Chih-Ching Chang" />
    <div className={style.post}>
      <div className={style.postContent}>
        <h2>Chih-Ching Chang</h2>
        <h3>Software Engineer</h3>
        <div style={{ borderBottom: '1px dashed white' }} />
        <h4>Project</h4>
        <div style={{ borderBottom: '1px solid white' }} />
        <h4>Education</h4>
        <div style={{ borderBottom: '1px solid white' }} />
        <h4>Honor</h4>
        <div style={{ borderBottom: '1px solid white' }} />
      </div>
    </div>
  </Layout>
);

export default AboutPage;
