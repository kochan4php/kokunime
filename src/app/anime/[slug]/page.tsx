export default function DetailAnime(props: any) {
    const { slug } = props.params;

    return (
        <>
            <h1>{slug}</h1>
        </>
    );
}
