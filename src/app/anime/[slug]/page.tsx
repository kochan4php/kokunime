export default function DetailAnime(props: any): JSX.Element {
    const { slug } = props.params;

    return (
        <>
            <h1>{slug}</h1>
        </>
    );
}
