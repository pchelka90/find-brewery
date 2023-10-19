I'mimport React from 'react';
import { useState, useEffect, useCallback } from 'react';
import { Header } from './Header';
import Button from 'react-bootstrap/Button';

function App() {
  const [brewery, setBrewery] = useState('');
  const [index, setIndex] = useState(0);
  const [brewData, setBrewData] = useState([]);

  useEffect(() => {
    const lastIndex = brewery.length - 1;
    if (index < 0) {
      setIndex(lastIndex);
    }
    if (index > lastIndex) {
      setIndex(0);
    }
  }, [index, brewery]);

  useEffect(() => {
    let slider = setInterval(() => {
      setIndex(index + 1);
    }, 5000);
    return () => clearInterval(slider);
  }, [index]);

  useEffect(() => {
    getBreweries('');
  }, []);

  const onLocChange = useCallback((event) => {
    console.log(event.target.value);
    setBrewery(event.target.value);
  }, []);

  const formSubmitted = useCallback(
    (event) => {
      event.preventDefault();
      console.log('sukces');
      console.log(brewery);
      getBreweries(brewery);
    },
    [brewery]
  );

  const clearOnInputClick = () => {
    setBrewery('');
  };

  function getBreweries(location) {
    const transformedLocation = location.split(' ').join('_');
    fetchBrew();
    async function fetchBrew() {
      const res = await fetch(
        `https://api.openbrewerydb.org/breweries/search?query=${transformedLocation}`
      );
      const data = await res.json();

      //Sorting function
      data.sort((a, b) => {
        var nameA = a.name.toLowerCase(),
          nameB = b.name.toLowerCase();
        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }
        return 0;
      });

      setBrewData(data);
      console.log(data);

      if (data.length === 0) {
      } else {
      }
    }
  }

  return (
    <div className='App'>
      <Header>
        <div class='inputBtn'>
          <div className='center'>
            <form className='search' onSubmit={formSubmitted}>
              <input
                type='search'
                className='formInput'
                placeholder='Please type only United States cities,  Montana or Ohio for example'
                value={brewery}
                onChange={onLocChange}
                onClick={clearOnInputClick}
              />
              <Button variant='danger' className='btn primary inside'>
                SEARCH
              </Button>
            </form>
          </div>
        </div>
      </Header>
      <div className='section-center'>
        {brewData.map((brewery, breweryIndex) => {
          const {
            id,
            name,
            brewery_type,
            street,
            address_2,
            address_3,
            city,
            state,
            county_province,
            postal_code,
            country,
            longitude,
            latitude,
            phone,
            website_url,
            updated_at,
            created_at,
          } = brewery;

          let position = 'nextSlide';
          if (breweryIndex === index) {
            position = 'activeSlide';
          }
          if (
            breweryIndex === index - 1 ||
            (index === 0 && breweryIndex === brewery.length - 1)
          ) {
            position = 'lastIndex';
          }
          return (
            <article key={id} className={position}>
              <h4>{name}</h4>
              <p className='title'>
                {brewery_type}
                <br></br>
                {street}
              </p>
              <p className='addresses'>
                {address_2 || null}
                {address_3 || null}
              </p>
              <p className='text'>
                {city}, {state}
                <br></br>
                {county_province} {postal_code}, {country}
              </p>
              {phone && <p className='phone'>Phone number: {phone} </p>}
              {website_url && (
                <a href={website_url}>
                  <Button variant='danger'>Website</Button>
                </a>
              )}
              {longitude && (
                <p className='coordinates'>Longitude: {longitude}</p>
              )}
              {latitude && <p className='coordinates'>Latitude: {latitude}</p>}
              <p className='infoData'>
                {updated_at}
                <br></br>
                {created_at}
              </p>
              <Button
                variant='warning'
                className='prev'
                onClick={() => setIndex(index - 1)}
              >
                Previous
              </Button>
              <Button
                variant='warning'
                className='next'
                onClick={() => setIndex(index + 1)}
              >
                Next
              </Button>
            </article>
          );
        })}
      </div>
    </div>
  );
}

export default App;
