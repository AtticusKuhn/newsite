import Link from "next/link"
import React from "react"

type linkprops = { href: string } & React.DetailedHTMLProps<React.AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>

const MyLink: React.FC<linkprops> = (props) => {
    return <Link href={props.href} className="pop rounded bg-primary-300 p-1 m-1 hover:bg-primary-100">
            {props.children}
    </Link>
}
export default MyLink
