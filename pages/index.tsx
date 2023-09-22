// import Link from 'next/link'
import { NextSeo } from 'next-seo'
import React from 'react'
import Button from '../components/Button'
import Heading from '../components/Heading'
import Layout from '../components/Layout'
import MyLink from '../components/MyLink'

function IndexPage() {
  return <Layout>
    <NextSeo
      title="home"
      description="My name is Atticus Kuhn, and welcome to my website to learn about me."
    />
    <Heading>
      Hello, my name is Atticus Kuhn
    </Heading>
    <div className="flex flex-col  sm:flex-row">
      <div className="p-3xl">
        <img width="900" height="900" src="images/tux.jpg" />
      </div>
      <div className="p-3xl">
        <p className="p-3xl">
    Hello, my name is <MyLink href="/notes/828fe821-41a1-492c-ac3b-6d875d8494cf"> Atticus Kuhn</MyLink> .
    I am currently an undergraduate student studying
  <MyLink href="/notes/8f7be8df-92b0-4cc9-8cac-256081935e94"> Computer Science</MyLink>
  at <MyLink href="/notes/92f8de84-d2a3-4418-a97f-b7e1651ff34c"> Trinity College</MyLink>,
    <MyLink href="/notes/517f8b21-0d69-42dc-b902-0fd6ca8299e0"> Cambridge </MyLink> .
    My passions include programming
          and mathematics. Feel free to check out
  <MyLink href="/blog" > my blog</MyLink>  or
  <MyLink href ="/projects"> my projects </MyLink>
  to see what I am currently up to.


        </p>
        <div className="flex flex-col ">
          <Button link="/notes/828fe821-41a1-492c-ac3b-6d875d8494cf">Learn more about me &gt;&gt;</Button>
          <Button link="/projects">See my projects &gt;&gt;</Button>
          <Button link="/blog">Hear my opinions &gt;&gt;</Button>
        </div>
      </div>
    </div>
  </Layout>
}

export default IndexPage
