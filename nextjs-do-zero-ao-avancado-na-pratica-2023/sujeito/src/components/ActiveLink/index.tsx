import React, { ReactElement } from "react";
import Link, { LinkProps } from "next/link";
import { useRouter } from "next/router";

interface ActiveLinkProps extends LinkProps {
    children: string;
    activeClassName: string;
    href: string;
}

export default function ActiveLink({
    children,
    href,
    activeClassName,
    ...props
}: ActiveLinkProps) {
    const { asPath } = useRouter();
    const className = asPath === href ? activeClassName : "";

    return (
        <Link href={href} className={className} {...props}>
            {children}
        </Link>
    );
}
