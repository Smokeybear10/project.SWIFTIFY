import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CssBaseline, ThemeProvider } from '@mui/material';
import { createTheme } from "@mui/material/styles";

import NavBar from './components/NavBar';
import HomePage from './pages/HomePage';
import AlbumsPage from './pages/AlbumsPage';
import SongsPage from './pages/SongsPage';
import AlbumInfoPage from './pages/AlbumInfoPage';

import './swiftify.css';

export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#ec4899' },
    secondary: { main: '#fb7185' },
    background: { default: '#0d0508', paper: '#1a0a12' },
    text: { primary: '#fff1f7', secondary: 'rgba(255,241,247,0.6)' },
  },
  typography: {
    fontFamily: "'Inter', sans-serif",
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#0d0508',
          color: '#fff1f7',
        },
      },
    },
  },
});

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {/* Background overlays — must be position fixed to avoid layout contribution */}
      <div className="sw-vignette" style={{ position: 'fixed', inset: 0, zIndex: 1, pointerEvents: 'none' }} />
      <svg className="sw-noise" aria-hidden="true" style={{ position: 'fixed', inset: 0, zIndex: 2, pointerEvents: 'none', width: '100%', height: '100%', opacity: 0.03 }}>
        <filter id="noise-filter">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/>
        </filter>
        <rect width="100%" height="100%" filter="url(#noise-filter)"/>
      </svg>
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/albums" element={<AlbumsPage />} />
          <Route path="/albums/:album_id" element={<AlbumInfoPage />} />
          <Route path="/songs" element={<SongsPage />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}