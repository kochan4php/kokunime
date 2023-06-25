import { axiosInstance } from "@/config";
import { ResponseGetRekomendasiType } from "@/interfaces";
import strLimit from "@/utils/strLimit";
import Image from "next/image";
import Link from "next/link";

const RekomendasiAnime = async (): Promise<JSX.Element> => {
  const { data: getRekomendasi } = await axiosInstance.get("/rekomendasi");
  const rekomendasiAnime = getRekomendasi.data;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2 md:gap-4">
      {rekomendasiAnime.map(
        (item: ResponseGetRekomendasiType, index: number) => (
          <div className="w-full grid grid-cols-3 gap-3 pt-4 group" key={index}>
            <div>
              <div className="bg-cover bg-center h-full bg-no-repeat selection:bg-violet-500 rounded overflow-hidden bg-slate-700">
                <div className="min-w-full h-full py-3">
                  <Link href={`/anime/${item.endpoint}`}>
                    <div className="cursor-pointer group px-2 relative min-h-full">
                      <div className="group px-1 relative min-h-full">
                        <Image
                          src={item.image}
                          alt="thumbnail"
                          width="0"
                          height="0"
                          sizes="100vw"
                          className="rounded-sm"
                          style={{
                            width: "100%",
                            height: "auto",
                          }}
                          priority
                          quality={40}
                        />
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
            <div className="col-span-2 py-2">
              <Link
                href={`/anime/${item.endpoint}`}
                className="text-base md:text-lg font-semibold group-hover:text-pink-500 transition-colors duration-300"
              >
                {strLimit(item.title, 45)}
              </Link>
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default RekomendasiAnime;
