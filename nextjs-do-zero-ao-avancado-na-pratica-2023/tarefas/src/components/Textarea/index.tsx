import React from "react";
import styles from "./styles.module.css";
import { HtmlProps } from "next/dist/shared/lib/html-context";

export default function Textarea({ ...rest }: HtmlProps<HTMLTextAreaElement>) {
    return <textarea className={styles.textarea} {...rest}></textarea>;
}
