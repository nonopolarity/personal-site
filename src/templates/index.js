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
          I am Chih-Ching Chang, a developer who is interested in frontend
          development, data visualization and human-computer interaction. I also
          have experience in fullstack web development, machine learning,
          computer graphics and cryptography.
        </p>
        Sometimes I help open source projects' localization in my spare time :)
        <ul>
          <li>
            <a href="https://crowdin.com/profile/eyeccc">Crowdin</a>
          </li>
          <li>
            <a href="https://developer.mozilla.org/zh-TW/profiles/eyeccc">
              MDN Web Docs
            </a>
          </li>
        </ul>
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
