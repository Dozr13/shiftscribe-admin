import '../../styles/globals.css';

async function getData() {
  const index = Math.floor(Math.random() * 10);
  const res = await fetch(
    `https://dog-facts-api.herokuapp.com/api/v1/resources/dogs?index=${index}`,
  );

  // ! Not json need to change
  // const data = await res.json();
  // console.log(data); // Check the parsed JSON data

  const text = await res.text();
  console.log(text); // Check the response content

  return text;
}

export default async function Page() {
  const data = await getData();
  return <p>{data}</p>;
}
