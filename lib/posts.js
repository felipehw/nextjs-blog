import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

/**
 * @typedef {Object} PostMetadata
 * @property {string} id
 * @property {string} title
 * @property {string} date
 */

const postsDirectory = path.join(process.cwd(), 'posts');

/**
 * @returns {PostMetadata[]}
 */
export function getSortedPostsData() {
    // Get file names under /posts
    const fileNames = fs.readdirSync(postsDirectory);
    const allPostsData = fileNames.map((fileName) => {
        // Remove ".md" from file name to get id
        const id = fileName.replace(/\.md$/, '');

        // Read markdown file as string
        const fullPath = path.join(postsDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, 'utf8');

        // Use gray-matter to parse the post metadata section
        const matterResult = matter(fileContents);

        // Combine the data with the id
        /**
         * @type {PostMetadata}
         */
        const post = {
            id,
            date: matterResult.data.date,
            title: matterResult.data.title,
        }
        return post;
    });

    // [Destructuring assignment - JavaScript | MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment)
    return allPostsData.sort(({ date: a }, { date: b }) => {
        if (a < b) {
            return 1;
        } else if (a > b) {
            return -1;
        } else {
            return 0;
        }
    });
};

/**
 * @typedef {Object} PostIdMetadata
 * @property {Object} params
 * @property {string} params.id
*/

/**
 * 
 * @returns {PostIdMetadata[]}
 */
export function getAllPostIds() {
    const fileNames = fs.readdirSync(postsDirectory);
    return fileNames.map((fileName) => {
        return {
            params: {
                id: fileName.replace(/\.md$/, '')
            }
        };
    });
};


/**
 * @typedef {Object} PostData
 * @property {string} id
 * @property {string} title
 * @property {string} date
 * @property {string} contentHtml
 */

/**
 * 
 * @param {string} id 
 * @returns {Promise<PostData>}
 */
export async function getPostData(id) {
    const fullPath = path.join(postsDirectory, `${id}.md`);
    const fileContents = fs.readFileSync(fullPath, 'utf8');

    // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents);

    // Use remark to convert markdown into HTML string
    const processedContent = await remark()
        .use(html)
        .process(matterResult.content);
    const contentHtml = processedContent.toString();

    // Combine the data with the id
    return {
        id,
        date: matterResult.data.date,
        title: matterResult.data.title,
        contentHtml
    };
}