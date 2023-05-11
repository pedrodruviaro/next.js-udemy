import React from "react";
import styles from "./styles.module.scss";
import Image from "next/image";
import logo from "../../../public/images/logo.svg";
import ActiveLink from "../ActiveLink";

export default function Header() {
    return (
        <header className={styles.headerContainer}>
            <div className={styles.headerContent}>
                <a href="/" aria-label="Home">
                    <Image src={logo} alt="Sujeito Programador" priority />
                </a>

                <nav>
                    <ActiveLink href="/" activeClassName={styles.active}>
                        Home
                    </ActiveLink>
                    <ActiveLink href="/posts" activeClassName={styles.active}>
                        Conteúdos
                    </ActiveLink>
                    <ActiveLink href="/sobre" activeClassName={styles.active}>
                        Quem somos
                    </ActiveLink>
                </nav>

                <a href="https://pedroruviaro.tech" type="button" className={styles.readyButton}>
                    Começar
                </a>
            </div>
        </header>
    );
}
