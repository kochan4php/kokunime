import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getAnimeWithPagination } from "../../action";
import { MainCard } from "../../components";
import { For, RenderIfFalse, RenderIfTrue } from "../../utils";

const AddNewSeries = () => {
  const router = useRouter();
  const { slug } = router.query;
  const [anime, setAnime] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const getData = async () => {
    const res = await getAnimeWithPagination();
    if (res.status === 200) {
      if (res.data.success !== false) {
        const dataAnime = res.data
          .filter((data) => data?.link?.endpoint.split("/")[0] !== slug)
          .slice(0, 5);
        setAnime(dataAnime);
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    setIsLoading(true);
    getData();
  }, [slug]);

  return (
    <>
      <RenderIfTrue isTrue={isLoading}>
        <div className="container">
          <p className="text-base font-medium">
            Mengambil data anime terbaru...
          </p>
        </div>
      </RenderIfTrue>
      <RenderIfFalse isFalse={isLoading}>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 lg:gap-6">
          <For
            each={anime}
            render={(data, index) => (
              <MainCard
                key={index}
                path={`/details/${data?.link?.endpoint}`}
                image={data?.link?.thumbnail}
                title={data?.title}
                py="py-5"
                fontsize="text-base"
              />
            )}
          />
        </div>
      </RenderIfFalse>
    </>
  );
};

export default AddNewSeries;
