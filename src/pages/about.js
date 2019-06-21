import React from 'react';

import Layout from '../components/layout';
import SEO from '../components/seo';
// import Img from 'gatsby-image';
// import { graphql } from "gatsby";
import style from '../styles/post.module.css';

const AboutPage = () => (
  <Layout>
    <SEO title="Chih-Ching Chang" />
    <div className={style.post}>
      <div className={style.postContent}>
        {/* <Img fixed={data.file.childImageSharp.fixed} /> */}
        <h2>Chih-Ching Chang</h2>
        <h3>Software Engineer</h3>
        <p>
          Placeholder
        </p>
      </div>
    </div>
  </Layout>
);

/*
export const query = graphql`
  query {
    file(relativePath: { eq: "images/chihching.jpg" }) {
      childImageSharp {
        # Specify the image processing specifications right in the query.
        # Makes it trivial to update as your page's design changes.
        fixed(width: 125, height: 125) {
          ...GatsbyImageSharpFixed
        }
      }
    }
  }`;
  */

export default AboutPage;
