import Head from "next/head";
import Footer from "../components/Footer";
import { getPostByUri } from "../lib/test-data";
import { client } from "../lib/apollo";
import { gql } from "@apollo/client";

export default function SlugPage({ post }) {
  return (
    <div>
      <Head>
        <title>Headless WP Next Starter</title>
        <link rel="icon" href="favicon.ico"></link>
      </Head>

      <main>
        <div className="siteHeader">
          <h1 className="title">{post.title}</h1>
          <p>
            ✍️ &nbsp;&nbsp;
            {`${post.author.node.firstName} ${post.author.node.lastName}`} | 🗓️
            &nbsp;&nbsp;{new Date(post.date).toLocaleDateString()}
          </p>
        </div>
        <article dangerouslySetInnerHTML={{ __html: post.content }}></article>
      </main>

      <Footer></Footer>
    </div>
  );
}

export async function getStaticProps({ params }) {
  const GET_LISTING_BY_URI = gql`
    query GetListingByURI($id: ID!) {
      listing(id: $id, idType: URI) {
        title
        uri
        date
      }
    }
  `;

  const response = await client.query({
    query: GET_LISTING_BY_URI,
    variables: {
      id: params.uri,
    },
  });
  const post = response?.data?.listing;
  return {
    props: {
      post,
    },
  };
}

//allows next js to pre render different paths and optimise app for those routes. pass in an empty array.
export async function getStaticPaths() {
  const paths = [];
  return {
    paths,
    fallback: "blocking",
  };
}
