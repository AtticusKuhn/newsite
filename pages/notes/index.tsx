import { NextSeo } from "next-seo"
// import Link from "next/link"
import React, { useState } from "react"
import Heading from "../../components/Heading"
import Input, { useInput } from "../../components/Input"
import Layout from "../../components/Layout"
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
            <p className="mx-3xl">
    These are my notes. I write down all my ideas and knowledege into my notes.
    I am making my notes public because I want to share what I know, so that
  others may learn. If you want to learn more about my notes, see <MyLink href="/notes/7af6f3dc-6cc3-4b6a-88b5-278d6e7d1163">
    How I Take Notes </MyLink>
  </p>
    <div className="grid grid-cols-3 my-lg">
    {items.map( (item) => (<MyLink href={`/notes/${JSON.parse(item.id)}`}>{JSON.parse(item.title)}</MyLink>))}
  </div>
        </Layout>
    </>
}

export const getServerSideProps = async () => {
  const db = await getDB();
  const items = await db.all("SELECT id , notes.title FROM notes INNER JOIN tags ON notes.ID = tags.node_id INNER JOIN files ON files.file = notes.path WHERE tags.tag = \'\"public\"\' ORDER BY files.mtime DESC");


    return {
        props: {
            items
        }
    }
}
// export getStaticProps
export default Notes
