import React from 'react';
import {
  Grid,
  Button,
  ButtonGroup,
  Box,
  Divider,
  Text,
} from '@chakra-ui/react';
import { GetStaticProps } from 'next';
import PokemonCard from '../components/PokemonCard';
import { PokeAPI } from 'pokeapi-types';
import PaginationGroup from '../components/PaginationGroup';

interface Props {
  data: PokeAPI.NamedAPIResourceList;
}

export default function Home({ data }: Props) {
  const [pokemonList, setPokemonList]: [
    typeof data,
    (input: typeof data) => void
  ] = React.useState(data);
  const [currentPage, setCurrentPage]: [number, (num: number) => void] =
    React.useState(1);
  const limit = 20;
  console.log(pokemonList);
  // Fetch next page of pokemons, updates the currentpage value and the data that is shown
  async function nextPage() {
    const res = await fetch(pokemonList.next);
    const newData: typeof data = await res.json();

    setCurrentPage(currentPage + 1);
    setPokemonList(newData);
  }

  // Fetch previous page of pokemons, updates the currentpage value and the data that is shown
  async function prevPage() {
    const res = await fetch(pokemonList.previous);
    const newData: typeof data = await res.json();

    currentPage > 0 ? setCurrentPage(currentPage - 1) : null;
    setPokemonList(newData);
  }

  return (
    <Box margin="6">
      <Divider colorScheme="gray" />
      <PaginationGroup
        currentPage={currentPage}
        pokemonList={pokemonList}
        nextPage={nextPage}
        prevPage={prevPage}
        limit={limit}
      ></PaginationGroup>
      <Grid
        templateColumns="repeat(auto-fit, minmax(250px, 1fr))"
        gap={6}
        marginTop="6"
      >
        {pokemonList.results.map((pokemon, index) => (
          <PokemonCard
            key={pokemon.name}
            pokemon={pokemon}
            index={index}
            currentPage={currentPage}
            limit={limit}
          ></PokemonCard>
        ))}
      </Grid>
      <PaginationGroup
        currentPage={currentPage}
        pokemonList={pokemonList}
        nextPage={nextPage}
        prevPage={prevPage}
        limit={limit}
      ></PaginationGroup>
    </Box>
  );
}

// rendering the first page during build for better first load performance
export const getStaticProps: GetStaticProps = async () => {
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon`);
  const data = await res.json();

  return {
    props: {
      data,
    },
  };
};
