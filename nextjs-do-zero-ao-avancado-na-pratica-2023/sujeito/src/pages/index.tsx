import Head from "next/head";
import styles from "../styles/home.module.scss";
import Image from "next/image";
import footerImage from "../../public/images/techs.svg";
import { GetStaticProps } from "next";
import { getPrismicClient } from "../services/prismic";
import Prismic from "@prismicio/client";
import { RichText } from "prismic-dom";

type Content = {
    title: string;
    titleContent: string;
    linkAction: string;
    mobileTitle: string;
    mobileContent: string;
    mobileBanner: string;
    webTitle: string;
    webContent: string;
    webBanner: string;
};

interface ContentProps {
    content: Content;
}

export default function Home({ content }: ContentProps) {
    return (
        <>
            <Head>
                <title>Apaxionado por tecnologia - Sujeito Programador</title>
            </Head>

            <main className={styles.container}>
                <div className={styles.containerHeader}>
                    <section className={styles.ctaText}>
                        <h1>{content.title}</h1>
                        <p>{content.titleContent}</p>

                        <a href={content.linkAction}>COMEÇAR AGORA</a>
                    </section>
                    <img src="/images/banner-conteudos.png" alt="Painel de cursos" />
                </div>

                <hr className={styles.divisor} />

                <div className={styles.sectionContent}>
                    <section>
                        <h2>{content.mobileTitle}</h2>
                        <p>{content.mobileContent}</p>
                    </section>

                    <img src={content.mobileBanner} alt="Mock de aplicativo mobile" />
                </div>

                <hr className={styles.divisor} />

                <div className={styles.sectionContent}>
                    <img src={content.webBanner} alt="Mock de aplicações web" />

                    <section>
                        <h2>{content.webTitle}</h2>
                        <p>{content.webContent}</p>
                    </section>
                </div>

                <footer className={styles.nextLevelContent}>
                    <Image quality={75} src={footerImage} alt="Stack de tecnologias" />
                    <h2>
                        Mais de <span>15 mil</span> já levaram sua carreira ao próximo nível
                    </h2>
                    <p>
                        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Non obcaecati vitae quas perspiciatis
                        consequuntur provident ut nisi enim quos explicabo!
                    </p>
                    <a href="#">COMEÇAR AGORA</a>
                </footer>
            </main>
        </>
    );
}

export const getStaticProps: GetStaticProps = async () => {
    const prismic = getPrismicClient();

    const response = await prismic.query([Prismic.Predicates.at("document.type", "home")]);

    const { title, subtitle, link_action, mobile, mobile_content, mobile_banner, web_title, web_content, web_banner } =
        response.results[0].data;

    const content = {
        title: RichText.asText(title),
        titleContent: RichText.asText(subtitle),
        linkAction: link_action.url,
        mobileTitle: RichText.asText(mobile),
        mobileContent: RichText.asText(mobile_content),
        mobileBanner: mobile_banner.url,
        webTitle: RichText.asText(web_title),
        webContent: RichText.asText(web_content),
        webBanner: web_banner.url,
    };

    return {
        props: {
            content,
        },
        revalidate: 60 * 2,
    };
};
