import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import Banner from "../components/Banner";
import heroImage from "../../public/static/hero-image.png";
import Card from "../components/Card";
import { getCoffeeStores } from "../../lib/coffee-stores";

export default function Home({ coffeeStores }) {
    console.log(coffeeStores);
    const handleOnBannerClick = (event) => {};

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

                {coffeeStores.length > 0 && (
                    <>
                        <h2 className={styles.heading2}>
                            Toronto Coffee Stores
                        </h2>

                        <div className={styles.cardLayout}>
                            {coffeeStores?.map((item) => (
                                <Card
                                    key={item.fsq_id}
                                    name={item.name}
                                    image={
                                        item.imgUrl ||
                                        "https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"
                                    }
                                    href={`/coffee-store/${item.fsq_id}`}
                                    className={styles.card}
                                />
                            ))}
                        </div>
                    </>
                )}
            </main>
        </div>
    );
}

export async function getStaticProps() {
    const coffeeStores = await getCoffeeStores();

    return {
        props: {
            coffeeStores,
        },
    };
}
