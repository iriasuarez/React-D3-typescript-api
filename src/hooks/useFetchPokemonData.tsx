import { useQuery } from "@tanstack/react-query";
import { DataItem } from "../App";

const fallbackData: DataItem[] = [
  { name: "East", value: 100 },
  { name: "West", value: 132 },
  { name: "North", value: 221 },
  { name: "South", value: 87 },
];

const fetchChartData = async (): Promise<DataItem[]> => {
  try {
    await new Promise((resolve) => setTimeout(resolve, 3000)); // I did this to show the loader which is cute ;)
    const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=6");
    if (!response.ok) throw new Error("Network response was not ok");

    const data = await response.json();

    const pokemonDetails: DataItem[] = await Promise.all(
      data.results.map(async (pokemon: { name: string; url: string }) => {
        const pokeResponse = await fetch(pokemon.url);
        if (!pokeResponse.ok)
          throw new Error("Failed to fetch Pokémon details");

        const pokeData = await pokeResponse.json();
        const attackStat =
          pokeData.stats.find(
            (stat: { stat: { name: string }; base_stat: number }) =>
              stat.stat.name === "attack"
          )?.base_stat || 0;

        return {
          name: pokeData.name,
          value: attackStat,
        };
      })
    );

    return pokemonDetails;
  } catch (err) {
    console.error("Fetching error:", err);
    return fallbackData;
  }
};

export const useFetchPokemonData = () => {
  const QUERY_KEY_POKEMON_DATA = "pokemonData";
  const { data, error, isLoading, isFetching } = useQuery({
    queryKey: [QUERY_KEY_POKEMON_DATA],
    queryFn: fetchChartData,
    initialData: [],
    refetchOnWindowFocus: false,
  });

  return { data, loading: isLoading || isFetching, error };
};
