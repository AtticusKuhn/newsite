import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";
import { BlogJsonLd, NextSeo } from "next-seo";
import React from "react";
import Heading from "../../components/Heading";
import Layout from "../../components/Layout";
import OrgViewer from "../../components/OrgViewer";

import fs from "fs"

import {getDB} from "../../lib/db";
import { unified } from 'unified';
import parse from 'uniorg-parse';
import { parse as parse2 } from 'uniorg-parse/lib/parser';

import uniorg2rehype from 'uniorg-rehype';
import highlight from 'rehype-highlight';
import katex from 'rehype-katex';
import stringify from 'rehype-stringify';


import MyLink from "../../components/MyLink"
import CommentsSection from "../../components/CommentsSection";


function Note({note, contents, outlinks, inlinks, tags }) {


    return <Layout>
        <NextSeo
        title ={note.title}
    description={contents.substring(0, 100)}
      openGraph={{
        title: note.tite,
        description: contents.substring(0, 100),
        url: `atticusmkuhn.com/note/${note.id}`,
        type: 'article',
        article: {
          authors: [
            'atticusmkuhn.com'
          ],
          tags: tags,
        },
      }}
    />
        <Heading>{note.title}</Heading>
        <div className="text-sm">Written By <MyLink href="/notes/828fe821-41a1-492c-ac3b-6d875d8494cf">Atticus Kuhn</MyLink> </div>
        <div className="text-sm">Tags: {tags.map(t => t.tag).join(", ")}</div>
 <div className="text-justify my-3xl w-10/12 sm:w-8/12 mx-auto">
        <OrgViewer contents={contents} />
        </div>
        {(outlinks.length > 0 || inlinks.length > 0) && (<>
    <Heading>See Also</Heading>
    {outlinks.map( (item, index : number) =>
        (<MyLink key={index} href={`/notes/${JSON.parse(item.source)}`}>{JSON.parse(item.title)}</MyLink>))}

    {inlinks.map( (item, index : number) =>
        (<MyLink key={index} href={`/notes/${JSON.parse(item.dest)}`}>{JSON.parse(item.title)}</MyLink>))}
                              </>)}
    <CommentsSection />

    </Layout>
}

export const getServerSideProps = async (context) => {
    const db = await getDB();

    const s = JSON.stringify(context.params.slug);
    const note = await db.get("SELECT * FROM notes where id = ?",s);
    if(!note)
        return {
            notFound: true,
        }
    const isPublic = await db.get("SELECT 1 FROM tags WHERE node_id = ? AND tags.tag = \'\"public\"\' LIMIT 1", s)
    if(!isPublic){
        return {
            props : {
                note: {title:"Private Note"},
                contents: "private note",
                outlinks: [],
                inlinks: [],
                html: "private note",
                tags: []
            }
        }
    }

    const outlinks = await db.all("SELECT * FROM links INNER JOIN notes ON notes.id = links.source where dest = ?",s )
    const inlinks = await db.all("SELECT * FROM links INNER JOIN notes ON notes.id = links.dest   where source = ? ",s )
    const tags = await db.all("SELECT * from tags WHERE node_id = ?", s)
    const contents = fs.readFileSync(JSON.parse(note.path), "UTF-8");
    const processor = unified()
        .use(parse)
        .use(uniorg2rehype)
        .use(highlight, {aliases: {agda: "agda2"}})
        .use(katex)
        .use(stringify);
    const html = await processor.process(contents);

    // const p2 = unified().use(parse).use(stringify)
    // const parsed = await p2.process(contents);
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
