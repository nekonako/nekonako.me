import React from 'react'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import SideNav from '../../components/SideNav'
import tempe from 'tempe'
import siteData from '../../site-data'
import Head from 'next/head'
import {DiscussionEmbed} from "disqus-react"


function PostPage(props){
  const cover = '/assets/post/' + props.post.slug + '/cover.png'

  const disqusShortname = "nekonako"
  const disqusConfig = {
    url: "https://nekonako.me/post/"+props.post.slug,
    identifier: props.post.id,
    title: props.post.title
  }

  return (
    <>
      <Head>
        <title>Artikel | {props.post.title}</title>
      </Head> 
        <SideNav />
        <Navbar />
       <div className="relative flex flex-col w-full md:w-2/3">
         <img src={cover} className='mt-16 md:mt-0'/> 
          <main className="flex-1 p-6 md:p-8">
                       <div className="md:p-4">
                         <div className='pb-12 text-3xl font-bold text-center md:text-4xl'>{props.post.title}</div>
                         <div className='px-2 md:px-4 content'><span dangerouslySetInnerHTML={{ __html: props.post.content }} /></div>
              <div className='px-4 pt-8'>
                             <DiscussionEmbed
                  shortname={disqusShortname}
                  config={disqusConfig}
                />
              </div>
            </div>
              </main>
           <Footer/>
         </div>
      
    </>
  )
}

export async function getStaticProps(context){
  const fs = require('fs');
  const html = require('remark-html');
  const highlight = require('remark-prism')
  const unified = require('unified');
  const markdown = require('remark-parse');
  const matter = require('gray-matter');

  const slug = context.params.slug;
  const path = `${process.cwd()}/contents/${slug}.md`;

  const rawContent = fs.readFileSync(path, {
    encoding : "utf-8"
  });

  const { data, content } = matter(rawContent);

  const result = await unified()
    .use(markdown)
    .use(highlight)
    .use(html)
    .process(content);

  return {
    props: {
      post : {
        ...data,
        content : result.toString(),
      }
    },
  };
}

export async function getStaticPaths(context){
  const fs = require('fs');

  const path = `${process.cwd()}/contents`;
  const files = fs.readdirSync(path, "utf-8");

  const markdownFileNames = files
    .filter((fn) => fn.endsWith('.md'))
    .map((fn) => fn.replace('.md', ''));

  return {
    paths: markdownFileNames.map((fileName) => {
      return {
        params : {
          slug : fileName,
        },
      };
    }),
    fallback : false,
  };
}

export default PostPage


