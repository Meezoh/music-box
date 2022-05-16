import { useEffect, useState } from "react";
import "./App.css";
import camelcaseKeys from "camelcase-keys";

// components
import Details from "./components/Details";
import Error from "./components/Error";
import Loading from "./components/Loading";

const App = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [range, setRange] = useState(5);
  const [counter, setCounter] = useState(1);
  const [details, setDetails] = useState([]);
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (range >= 5 && range <= 20) {
      setError(null);
      fetch("https://random-words-api.vercel.app/word")
        .then((res) => {
          if (!res.ok) throw Error("Unable to fetch data...");
          return res.json();
        })
        .then((data) => {
          setData(data);
          if (counter < range * 2 && details.length < range)
            setCounter(counter + 1);
          fetch(
            `https://musicbrainz.org/ws/2/recording?query=${data[0].word}&fmt=json&limit=1`
          )
            .then((musicRes) => musicRes.json())
            .then((musicData) => {
              const newData = camelcaseKeys(musicData.recordings[0]);
              const artist = newData?.artistCredit[0].name;
              const album = newData?.releases[0].title;
              const title = newData?.title;
              if (details.length < range && range <= 20) {
                details.push({ word: data[0].word, artist, album, title });
                setLoading(true);
              } else if (details.length == range) setLoading(false);
            });
        })
        .catch((err) => {});
    } else {
      setError("Input not within the range");
    }
  }, [range, counter]);

  useEffect(() => {
    setDetails([]);
  }, [range]);

  const handleSeek = () => {
    setShow(true);
  };

  const handleOnChange = (e) => {
    setRange(+e.target.value);
    if (+e.target.value >= 5 && +e.target.value <= 20) {
      setCounter(1);
      setShow(false);
    }
  };

  return (
    <div className="App">
      <h1>Music Box</h1>
      <p>Number has to be between 5 to 20</p>
      <div className="input-container">
        <input type="text" value={range} onChange={handleOnChange} />
        <button
          disabled={details.length == range ? false : true}
          onClick={handleSeek}
          className={
            details.length == range && range != 0 ? "btn" : "btn loading"
          }
        >
          Seek
        </button>
      </div>

      <ul className="details-container">
        {show
          ? details.map((music, i) => {
              const { title, artist, album, word } = music;
              return (
                <Details
                  i={i}
                  key={i}
                  title={title}
                  artist={artist}
                  album={album}
                  word={word}
                />
              );
            })
          : null}
      </ul>
      {loading && !error ? <Loading /> : null}
      {error ? <Error message={error} /> : null}
    </div>
  );
};

export default App;
