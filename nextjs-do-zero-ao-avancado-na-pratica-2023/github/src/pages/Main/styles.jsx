import styled, { keyframes, css } from "styled-components";

export const Container = styled.div`
    max-width: 700px;
    background-color: #fff;
    border-radius: 4px;
    padding: 30px;
    margin: 80px auto;
    box-shadow: 0 0 20px rgba(0 0 0 / 0.2);

    h1 {
        font-size: 20px;
        display: flex;
        align-items: center;
        gap: 0.625rem;
    }
`;

export const Form = styled.form`
    margin-top: 30px;
    display: flex;

    input {
        flex: 1;
        border: 1px solid ${(props) => (props.error ? "#ff0000" : "#ddd")};
        padding: 10px 15px;
        border-radius: 4px;
        font-size: 17px;
        outline: none;
    }
`;

export const SubmitButton = styled.button.attrs((props) => ({
    type: "submit",
    disabled: props.loading,
}))`
    background-color: #0d2636;
    border: 0;
    outline: none;
    border-radius: 4px;
    margin-left: 0.625rem;
    padding: 0 15px;
    display: grid;
    place-items: center;

    &[disabled] {
        cursor: not-allowed;
        opacity: 0.5;

        ${(props) =>
            props.loading &&
            css`
                svg {
                    animation: ${animate} 2s linear infinite;
                }
            `}
    }
`;

// Animação botão
const animate = keyframes`
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(360deg);
    }
`;

export const List = styled.ul`
    list-style: none;
    margin-top: 20px;

    li {
        padding: 15px 0;
        display: flex;
        align-items: center;
        justify-content: space-between;

        & + li {
            border-top: 1px solid #eee;
        }

        a {
            color: #0d2636;
            text-decoration: none;
        }
    }
`;

export const DeleteButton = styled.button.attrs({
    type: "button",
})`
    outline: none;
    border: none;
    background: transparent;
    color: #0d2636;
    padding: 8px 7px;
    border-radius: 4px;
`;
