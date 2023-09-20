import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";
import { BlogJsonLd, NextSeo } from "next-seo";
// import Link from "next/link";
import React, { Suspense, useEffect } from "react";
import Card from "../../components/Card";
import Heading from "../../components/Heading";
import Layout from "../../components/Layout";
import MdViewer from "../../components/MdViewer";
import { blog, findBlogBySlug, getBlogs } from "../../lib/blog";
import { randomItemsFromArray } from "../../lib/utils";
// import {exec} from "child_process"
// @ts-ignore
import { jsx, jsxs} from 'react/jsx-runtime'

import fs from "fs"

// import sqlite3 from "sqlite3";
// import { open, Database } from "sqlite";
import {getDB} from "../../lib/db";
import { unified } from 'unified';
import parse from 'uniorg-parse';
import uniorg2rehype from 'uniorg-rehype';
import highlight from 'rehype-highlight';
import katex from 'rehype-katex';
import stringify from 'rehype-stringify';
import rehype2react from 'rehype-react';
import { useState } from "react";


import MyLink from "../../components/MyLink"
import CodeViewer from "../../components/CodeViewer";
import Script from "next/script";

function Note({note, contents, outlinks, inlinks, html, tags }) {
           // .use(stringify);
    useEffect(()=>{
         const processor = unified()
        .use(parse)
        .use(uniorg2rehype)
        .use(highlight, {aliases:{agda:"agda2"}})
        .use(katex)
        .use(rehype2react, {
            // createElement: React.createElement,
            Fragment: React.Fragment,
            jsx, jsxs,
            components: {
                a: (props) => {
                    if(props.href.startsWith("id:")){
                        return <MyLink {...props} href={"/notes/" + props.href.substring(3)} />;
                    }else{
                        // @ts-ignore
                        return <MyLink {...props} />;
                    }
                },
 h1: (props) => {
                return <Heading {...props} size="3xl" />
            },
            h2: (props) => {
                return <Heading {...props} size="2xl" />
            },
            h3: (props) => {
                return <Heading {...props} size="xl" />
            },
            h4: (props) => {
                return <Heading {...props} size="lg" />
            },
                code: (props)=> {
                    console.log(props)
                    const language = props.className.match(/language-.*/gm)[0].substring(9);
                    const matchedLanguage = language === "agda2" ? "agda" : language
                    return <CodeViewer {...props} language={matchedLanguage} inline={true} />;
                },
            },
        });
    processor.process(contents).then(r => {
        ss(r.result);
    });
    }, [contents])

    const [s, ss] = useState(null)
    return <Layout>
        <Heading>{note.title}</Heading>
        <div className="text-sm">Written By <MyLink href="/notes/828fe821-41a1-492c-ac3b-6d875d8494cf">Atticus Kuhn</MyLink> </div>
        <div className="text-sm">Tags: {tags.map(t => t.tag).join(", ")}</div>
 <div className="text-justify my-3xl w-10/12 sm:w-8/12 mx-auto">
        {s === null ? <div dangerouslySetInnerHTML={{__html: html}}/> : s}
        </div>
        {(outlinks.length > 0 || inlinks.length > 0) && (<>
    <Heading>See Also</Heading>
    {outlinks.map( (item, index) =>
        (<MyLink key={index} href={`/notes/${JSON.parse(item.source)}`}>{JSON.parse(item.title)}</MyLink>))}

    {inlinks.map( (item, index) =>
        (<MyLink key={index} href={`/notes/${JSON.parse(item.dest)}`}>{JSON.parse(item.title)}</MyLink>))}
                              </>)}



        <Script
    data-isso="//comments.atticusmkuhn.com/"
    strategy="lazyOnload"
        src="//comments.atticusmkuhn.com/js/embed.min.js"
        onReady={()=>{
            //@ts-ignore
            window.Isso.init();
            //@ts-ignore
            window.Isso.fetchComments();
        }}
        />

        <section id="isso-thread">
        <noscript>Javascript needs to be activated to view comments.</noscript>
        </section>
    </Layout>
}

export const getServerSideProps = async (context) => {
    const db = await getDB();

  // Perform a database query to retrieve all items from the "items" table
    const s = JSON.stringify(context.params.slug);
    const note = await db.get("SELECT * FROM notes where id = ?",s);
    if(!note)
        return {
            notFound: true,
        }
    const isPublic = await db.get("SELECT 1 FROM tags WHERE node_id = ? AND tags.tag = \'\"public\"\' LIMIT 1", s)
    console.log("isPublic", isPublic)
    if(!isPublic)
        throw new Error("it's not public!")
    const outlinks = await db.all("SELECT * FROM links INNER JOIN notes ON notes.id = links.source where dest = ?",s )
    const inlinks = await db.all("SELECT * FROM links INNER JOIN notes ON notes.id = links.dest   where source = ? ",s )
    const tags = await db.all("SELECT * from tags WHERE node_id = ?", s)
    const contents = fs.readFileSync(JSON.parse(note.path), "UTF-8");
console.log(context.params)
  // console.log(items[0].properties);
    const processor = unified()
        .use(parse)
        .use(uniorg2rehype)
        .use(highlight, {aliases: {agda: "agda2"}})
        .use(katex)
        .use(stringify);
    const html = await processor.process(contents);
    console.log("html", html)
    return {
        props: {
            note,
            contents,
            outlinks, inlinks,
            html: html.value,
            tags,
        }
    }
}
export default Note
