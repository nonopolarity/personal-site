const { paginate } = require('gatsby-awesome-pagination')
const { forEach, uniq, filter, not, isNil, flatMap } = require('rambdax')
const path = require('path')
const { toKebabCase } = require('./src/helpers')

const pageTypeRegex = /src\/(.*?)\//
const getType = node => node.fileAbsolutePath.match(pageTypeRegex)[1]

const homeTemplate = path.resolve(`./src/templates/index.js`)
const pageTemplate = path.resolve(`./src/templates/page.js`)
const projectsTemplate = path.resolve(`./src/templates/projects.js`)
const postsTemplate = path.resolve(`./src/templates/posts.js`)
const tagsTemplate = path.resolve(`./src/templates/tags.js`)

exports.createPages = ({ actions, graphql, getNodes }) => {
  const { createPage } = actions
  const allNodes = getNodes()

  return graphql(`
    {
      allMarkdownRemark(
        sort: { fields: [frontmatter___date], order: DESC }
        limit: 1000
      ) {
        edges {
          node {
            frontmatter {
              path
              title
              tags
            }
            fileAbsolutePath
            fields {
              readingTime {
                text
              }
            }
          }
        }
      }
      site {
        siteMetadata {
          postsPerPage
        }
      }
    }
  `).then(result => {
    if (result.errors) {
      return Promise.reject(result.errors)
    }

    // create home page
    createPage({
      path: '/about',
      component: homeTemplate,
    })

    const {
      allMarkdownRemark: { edges: markdownPages },
      site: { siteMetadata },
    } = result.data

    /* const sortedPages = markdownPages.sort((pageA, pageB) => {
      const typeA = getType(pageA.node)
      const typeB = getType(pageB.node)

      return (typeA > typeB) - (typeA < typeB)
    }) */

    const posts = allNodes.filter(
      ({ internal, fileAbsolutePath }) =>
        internal.type === 'MarkdownRemark' &&
        fileAbsolutePath.indexOf('/posts/') !== -1,
    )

    /* const projects = allNodes.filter(
      ({ internal, fileAbsolutePath }) =>
        internal.type === 'MarkdownRemark' &&
        fileAbsolutePath.indexOf('/projects/') !== -1,
    ) */

    // Create posts index with pagination
    paginate({
      createPage,
      items: posts,
      component: postsTemplate,
      itemsPerPage: siteMetadata.postsPerPage,
      pathPrefix: '/',
    })

    /* paginate({
      createPage,
      items: projects,
      component: projectsTemplate,
      itemsPerPage: siteMetadata.postsPerPage,
      pathPrefix: '/projects',
    }) */

    // Create each markdown page and post
    forEach(({ node }, index) => {
      const previous = index === 0 ? null : markdownPages[index - 1].node
      const next =
        index === markdownPages.length - 1 ? null : markdownPages[index + 1].node
      const isNextSameType = getType(node) === (next && getType(next))
      const isPreviousSameType =
        getType(node) === (previous && getType(previous))

      createPage({
        path: node.frontmatter.path,
        component: pageTemplate,
        context: {
          type: getType(node),
          next: isNextSameType ? next : null,
          previous: isPreviousSameType ? previous : null,
        },
      })
    }, markdownPages)

    // Create tag pages
    const generateTagPages = data => {
      const tags = filter(
        tag => not(isNil(tag)),
        uniq(flatMap(d => d.frontmatter.tags, data)),
      )
    
      forEach(tag => {
        const itemsWithTag = data.filter(
          d =>
            d.frontmatter.tags && d.frontmatter.tags.indexOf(d) !== -1,
        );
    
        paginate({
          createPage,
          items: itemsWithTag,
          component: tagsTemplate,
          itemsPerPage: siteMetadata.postsPerPage,
          pathPrefix: `/tag/${toKebabCase(tag)}`,
          context: {
            tag,
          },
        })
      }, tags)
    };

    generateTagPages(posts);
    // generateTagPages(projects);

    return {
      sortedPages: markdownPages,
    }
  })
}

exports.sourceNodes = ({ actions }) => {
  const { createTypes } = actions
  const typeDefs = `
    type MarkdownRemark implements Node {
      frontmatter: Frontmatter!
    }

    type Frontmatter {
      title: String!
      date: Date!
      path: String!
      tags: [String!]
      excerpt: String
      coverImage: File
    }
  `
  createTypes(typeDefs)
}
