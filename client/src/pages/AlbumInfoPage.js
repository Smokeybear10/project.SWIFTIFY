import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { NavLink } from 'react-router-dom';

import SongCard from '../components/SongCard';
import { formatDuration, formatReleaseDate } from '../helpers/formatter';
const config = require('../config.json');

export default function AlbumInfoPage() {
  const { album_id } = useParams();

  const [songData, setSongData] = useState([]);
  const [albumData, setAlbumData] = useState({});
  const [selectedSongId, setSelectedSongId] = useState(null);

  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/album/${album_id}`)
      .then(res => res.json())
      .then(resJson => setAlbumData(resJson));

    fetch(`http://${config.server_host}:${config.server_port}/album_songs/${album_id}`)
      .then(res => res.json())
      .then(resJson => setSongData(resJson));
  }, [album_id]);

  return (
    <div className="sw-page">
      {selectedSongId && (
        <SongCard songId={selectedSongId} handleClose={() => setSelectedSongId(null)} />
      )}

      {/* Album header */}
      <div className="sw-album-info-header">
        <img
          src={albumData.thumbnail_url}
          alt={`${albumData.title} album art`}
        />
        <div>
          <h1>{albumData.title}</h1>
          <h2>Released: {formatReleaseDate(albumData.release_date)}</h2>
        </div>
      </div>

      {/* Track list */}
      <div className="sw-table-container">
        <table className="sw-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Title</th>
              <th>Plays</th>
              <th>Duration</th>
            </tr>
          </thead>
          <tbody>
            {songData.map((song) => (
              <tr key={song.song_id}>
                <td style={{ color: 'var(--text-muted)', width: '3rem' }}>{song.number}</td>
                <td>
                  <span
                    className="sw-link"
                    onClick={() => setSelectedSongId(song.song_id)}
                    style={{ cursor: 'pointer' }}
                  >
                    {song.title}
                  </span>
                </td>
                <td style={{ color: 'var(--text-muted)' }}>{song.plays?.toLocaleString()}</td>
                <td style={{ color: 'var(--text-muted)' }}>{formatDuration(song.duration)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
