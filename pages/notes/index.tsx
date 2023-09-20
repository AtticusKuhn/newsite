import { NextSeo } from "next-seo"
// import Link from "next/link"
import React, { useState } from "react"
import Heading from "../../components/Heading"
import Input, { useInput } from "../../components/Input"
import Layout from "../../components/Layout"
import PreviewCard from "../../components/PreviewCard"
import { blog, blogPreivew, getBlogs } from "../../lib/blog"
import { compareByDate, deleteKey, randomItemsFromArray } from "../../lib/utils"
import sqlite3 from "sqlite3";
import { open, Database } from "sqlite";
import MyLink from "../../components/MyLink"
import { getDB } from "../../lib/db"


function Notes({items}) {
    return <>
        <Layout>
            <NextSeo
                title="My Notes"
                description="My notes are my knowledge"
            />
            <Heading>My Notes</Heading>
            <p>These are my notes</p>
    <div className="grid grid-cols-3">
    {items.map( (item) => (<MyLink href={`/notes/${JSON.parse(item.id)}`}>{JSON.parse(item.title)}</MyLink>))}
  </div>
        </Layout>
    </>
}

export const getServerSideProps = async () => {
  const db = await getDB();
  // Perform a database query to retrieve all items from the "items" table
  // const tags = await db.get("SELECT * FROM tags");
  // console.log(tags)
  const items = await db.all("SELECT id , notes.title FROM notes INNER JOIN tags ON notes.ID = tags.node_id INNER JOIN files ON files.file = notes.path WHERE tags.tag = \'\"public\"\' ORDER BY files.mtime DESC LIMIT 20");

  console.log(items[0].properties);

    return {
        props: {
            items
        }
    }
}
// export getStaticProps
export default Notes
