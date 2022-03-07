import Head from 'next/head';
import Date from '../../components/date';
import Layout from "../../components/layout";
import { getAllPostIds, getPostData } from "../../lib/posts";
import utilStyles from '../../styles/utils.module.css';

/**
 * 
 * @param {import("../../lib/posts").PostIdMetadata} postIdMetadata 
 * @returns 
 */
export async function getStaticProps(postIdMetadata) {
    const postData = await getPostData(postIdMetadata.params.id);
    return {
        props: {
            postData
        }
    };
}

export async function getStaticPaths() {
    const paths = getAllPostIds();
    return {
        paths,
        fallback: false
    }
}

/**
 * 
 * @param {Object} param0 
 * @param {import("../../lib/posts").PostData} param0.postData
 * @returns 
 */
export default function Post({ postData } ) {
    return (
        <Layout>
            <Head>
                <title>{postData.title}</title>
            </Head>
            <article>
                <h1 className={utilStyles.headingXl}>{postData.title}</h1>
                <div className={utilStyles.lightText}>
                    <Date dateString={postData.date} />
                </div>
                <div dangerouslySetInnerHTML={{__html: postData.contentHtml}}/>
            </article>
        </Layout>
    );
}