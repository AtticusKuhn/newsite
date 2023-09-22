import React, {useEffect} from "react"
import rehype2react from 'rehype-react';
import { useState } from "react";
import { unified } from 'unified';
import parse from 'uniorg-parse';
import uniorg2rehype from 'uniorg-rehype';
import highlight from 'rehype-highlight';
import katex from 'rehype-katex';
import Heading from "./Heading"
import MyLink from "./MyLink"
import CodeViewer from "./CodeViewer";
// @ts-ignore
import { jsx, jsxs} from 'react/jsx-runtime'

const OrgViewer : React.FC<{contents: string}> = ({contents}) => {
    const [parsed, setParsed] = useState(<>{contents}</>)
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
        setParsed(r.result);
    });
    }, [contents])
    return <>
        {parsed}
        </>;
}
export default OrgViewer;
