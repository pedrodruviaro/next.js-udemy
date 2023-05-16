import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import Banner from "../components/Banner";
import heroImage from "../../public/static/hero-image.png";

export default function Home() {
    const handleOnBannerClick = (event) => {
        console.log(event);
    };

    return (
        <div className={styles.container}>
            <Head>
                <title>Coffee Connoisseur</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className={styles.main}>
                <Banner
                    handleOnClick={handleOnBannerClick}
                    buttonText="View stores nearby"
                />

                <div className={styles.heroImage}>
                    <Image
                        src={heroImage}
                        alt="Hero image"
                        width={700}
                        height={400}
                    />
                </div>
            </main>
        </div>
    );
}
