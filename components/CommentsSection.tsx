import Script from "next/script";
import { useEffect } from "react";
import Heading from "./Heading";
import { useRouter } from "next/router";


const CommentsSection = ()=>{
    const refresh = () => {
        //@ts-ignore
        let isso = window.Isso;
        if(isso){
            isso.init();
            isso.fetchComments();
        }
    }
    const router = useRouter();
    useEffect( () => {refresh()} , [router.asPath])
   return <>
        <Heading size="lg">Leave your Feedback in the Comments Section</Heading>
        <Script
        data-isso="//comments.atticusmkuhn.com/"
        strategy="lazyOnload"
        src="//comments.atticusmkuhn.com/js/embed.min.js"
        onReady={()=>{
            refresh();
        }}
        />
        <section id="isso-thread">
        <noscript>Javascript needs to be activated to view comments.</noscript>
        </section>
    </>
}
export default CommentsSection;
