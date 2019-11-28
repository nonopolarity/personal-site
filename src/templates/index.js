import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'gatsby';
import Img from 'gatsby-image';
import Layout from '../components/layout';
import SEO from '../components/seo';

import style from '../styles/post.module.css';

const HomePage = ({ data }) => (
  <Layout>
    <SEO title="About Chih-Ching" />
    <div className={style.post}>
      <div className={style.postContent}>
        <Img
          fluid={data.file.childImageSharp.fluid}
          style={{ width: 200, height: 200 }}
          alt="Chih-Ching with a random cat"
        />
        <h3>Hi there</h3>
        <p>
          I am Chih-Ching Chang, a software engineer from Taiwan. My work mainly
          focuses on frontend development. My tech stack for my daily work includes
          React (Hooks), GraphQL, TypeScript... etc.
          I also like to learn new stuff not limited to front-end fields (e.g., Jenkins or Docker).
        </p>
        <p>
          Sometimes I help open source
          projects' localization, such as{' '}
          <a href="https://crowdin.com/profile/eyeccc">Crowdin</a> or{' '}
          <a href="https://developer.mozilla.org/zh-TW/profiles/eyeccc">
            MDN Web Docs
          </a>{' '}
          , in my spare time :)
        </p>
      </div>
    </div>
  </Layout>
);

export const homeQuery = graphql`
  query {
    file(relativePath: { eq: "chihching.jpg" }) {
      childImageSharp {
        fluid(maxWidth: 200) {
          ...GatsbyImageSharpFluid
        }
      }
    }
  }
`;

HomePage.propTypes = {
  data: PropTypes.object.isRequired,
};

export default HomePage;
