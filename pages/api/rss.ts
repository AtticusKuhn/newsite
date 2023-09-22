// src/pages/api/rss/index.ts
import type { NextApiRequest, NextApiResponse } from 'next'

import { Feed } from 'feed';
import fs from "fs";
import { getDB } from '../../lib/db';
import { unified } from 'unified';
import parse from 'uniorg-parse';
import uniorg2rehype from 'uniorg-rehype';
import highlight from 'rehype-highlight';
import katex from 'rehype-katex';
import stringify from 'rehype-stringify';



export default async function handler(
  _: NextApiRequest,
  res: NextApiResponse<string>
) {
    const db = await getDB()
  const items = await db.all("SELECT id , notes.title , files.atime,  files.mtime, notes.path FROM notes INNER JOIN tags ON notes.ID = tags.node_id INNER JOIN files ON files.file = notes.path WHERE tags.tag = \'\"public\"\' ORDER BY files.mtime DESC LIMIT 10");
  const site_url = "atticusmkuhn.com"

  const feedOptions = {
    title: "Atticus Kuhn's Website",
    description: 'The notes of Atticus Kuhn',
    id: site_url,
    link: site_url,
    image: `${site_url}/logo.png`,
    favicon: `${site_url}/favicon.png`,
    copyright: `MIT License: ${new Date().getFullYear()}, Ibas`,
    generator: 'Feed for Node.js',
    feedLinks: {
      rss2: `${site_url}/api/rss`,
    },
  };

  const feed = new Feed(feedOptions);
  const results = items.map(async (post) => {

    const id = JSON.parse(post.id)
      // console.log(pos25867 10292t.mtime)
      const [high, low, msec, _] = post.mtime.replace(/[\(\)]/g,"").split(" ").map(x=>parseInt(x));
      const unixTime = (high * Math.pow(2,16) + low) * 1000 + msec;
      console.log("unixTime", unixTime);
      const date = new Date(unixTime);
    const contents = fs.readFileSync(JSON.parse(post.path), "UTF-8");
    const processor = unified()
        .use(parse)
        .use(uniorg2rehype)
        .use(highlight, {aliases: {agda: "agda2"}})
        .use(katex)
        .use(stringify);
    const html = await processor.process(contents);


    feed.addItem({
      title: post.title,
      id: `${site_url}/notes/${id}`,
      link: `${site_url}/notes/${id}`,
      description: html.value.toString(),
      date,
    });
  });
    await Promise.all(results);


    res.status(200).send(feed.rss2());
}
