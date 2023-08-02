import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';
import defaultImg from './assets/ai-image.jpg';
import loadingImg from './assets/tweaking-robot.gif';


function App() {
  const [data, setData] = useState(null);
  const [source, setSource] = useState('');
  const [loading, setLoading] = useState(false)

  const [num, setNum] = useState(10)


  useEffect(() => {
    const fetchData = async () => {
      setNum(10)
      setLoading(true)
      try {
        const response = await axios.get(`https://api-ainews.onrender.com/ai${source === '' ? '' : "/" + source}`);
        setData(response.data);
      } catch (error) {
        console.error('Error fetching news:', error);
      } finally {
        setLoading(false)
      }
    };

      fetchData();

  }, [source]);


  useEffect(() => {
    const handleScroll = () => {
      // Get the height of the content (total scrollable height)
      const contentHeight = document.documentElement.scrollHeight;
      // Get the current scroll position from the top
      const scrollPosition = window.scrollY + window.innerHeight;
      
      // Check if the scroll position is at the bottom or very close to it (10 pixels)
      if (scrollPosition >= contentHeight - 100) {
        setNum(prev => prev + 10)
      } 
      
    };

    // Attach the scroll event listener to the window
    window.addEventListener('scroll', handleScroll);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  
  },[num])


  const handleImageError = (e) => {
    e.target.src = defaultImg;
  };

  const handleScrollUp = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getWebsiteName = (url) => {
    const websiteUrl = new URL(url);
    const urls = websiteUrl.hostname.split('.')
    
    if (urls.length === 3) {
      return websiteUrl.hostname.split('.')[1] 
    }
    else if (urls.length === 2) {
      return websiteUrl.hostname.split('.')[0] 
    }
  };


  return (
    <div className="app-container">
      <header className="header">
        <h1>AI News (up2date)</h1>
          <select
            className=""
            id="source"
            value={source}
            onChange={(e) => setSource(e.target.value)}
            name="source"
          >
            <option value="" disabled hidden>
              Select the source
            </option>
            <option value="TechCrunch">TechCrunch</option>
            <option value="Mashable">Mashable</option>
            <option value="ZDNet">ZDNet</option>
            <option value="AnalyticsIndiaMagazine">Analytics India Magazine</option>
          <option value="">all available sources</option>
          </select>
      </header>
      {loading && <img className='loading-img' src={loadingImg} alt='' />}

      <div className="container">

        {data &&
          data.slice(0,num).map((link, index) => (
            <a href={link.url} target="_blank" key={index}>
              <div className="news-box" key={index}>
                {link.img && (
                  <img
                    className="news-image"
                    src={link.img}
                    alt={link.title}
                    onError={handleImageError}
                  />
                )}
                <div className="news-title">{link.title}</div>
                <a className="news-link" href={link.url} target="_blank" rel="noopener noreferrer">
                Read more from ({getWebsiteName(link.url)})
                </a>
              </div>
            </a>
          ))}
              
      </div>
      { num > 10 && <button className="scroll-up-button" onClick={handleScrollUp}>Scroll Up</button>}
      { num >= data?.length ? <p className="noMore">no more news at the moment</p> : null }
      <footer className="footer">
        <p>&copy; {new Date().getFullYear()} AI News | Developed by Bashar Subh | GitHub:
      <a href="https://github.com/BasharSubh/React-ContactsManager" target="_blank">https://github.com/basharsubh/</a></p>
      </footer>
    </div>
  );
}

export default App;
