import "./index.css";

const Details = (props) => {
  const { word, artist, album, title, i } = props;
  return (
    <li>
      <div>
        <span>Word:</span>
        <h3>{word}</h3>
      </div>
      <div>
        <span>Artist:</span>
        <p>{artist ? artist : "Not found"}</p>
      </div>
      <div>
        <span>Album:</span>
        <p>{album ? album : "Not found"}</p>
      </div>
      <div>
        <span>Title:</span>
        <p>{title ? title : "Not found"}</p>
      </div>
      <h6>{i + 1}</h6>
    </li>
  );
};

export default Details;
