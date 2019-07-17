import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'gatsby';
import SEO from '../components/seo';
import Layout from '../components/layout';
import Project from '../components/project';
import Navigation from '../components/navigation';

const ProjectPage = ({
  data,
  pageContext: { nextPagePath, previousPagePath },
}) => {
  const {
    allMarkdownRemark: { edges: projects },
  } = data;

  return (
    <>
      <SEO />
      <Layout>
        {projects.map(({ node }) => {
          const {
            id,
            excerpt: autoExcerpt,
            frontmatter: { title, date, path, coverImage, excerpt, tags },
          } = node;

          return (
            <Project
              key={id}
              title={title}
              date={date}
              path={path}
              coverImage={coverImage}
              tags={tags}
              excerpt={excerpt || autoExcerpt}
            />
          );
        })}

        <Navigation
          previousPath={previousPagePath}
          previousLabel="Newer projects"
          nextPath={nextPagePath}
          nextLabel="Older projects"
        />
      </Layout>
    </>
  );
};

ProjectPage.propTypes = {
  data: PropTypes.object.isRequired,
  pageContext: PropTypes.shape({
    nextPagePath: PropTypes.string,
    previousPagePath: PropTypes.string,
  }),
};

export const postsQuery = graphql`
  query($limit: Int!, $skip: Int!) {
    allMarkdownRemark(
      filter: { fileAbsolutePath: { regex: "//projects//" } }
      sort: { fields: [frontmatter___date], order: DESC }
      limit: $limit
      skip: $skip
    ) {
      edges {
        node {
          id
          excerpt
          frontmatter {
            title
            date(formatString: "DD MMMM YYYY")
            path
            author
            excerpt
            tags
            coverImage {
              childImageSharp {
                fluid(maxWidth: 800) {
                  ...GatsbyImageSharpFluid
                }
              }
            }
          }
        }
      }
    }
  }
`;

export default ProjectPage;
