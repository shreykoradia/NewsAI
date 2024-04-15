import React, { useState, useEffect } from 'react';
import { Typography } from '@material-ui/core';
import alanBtn from '@alan-ai/alan-sdk-web';
import NewsCards from './components/NewsCards/NewsCards';
import logo from './images/News AI-logos.jpeg';
import useStyles from './styles';
import wordsToNumbers from "words-to-numbers";
const App = () => {
  const [activeArticle, setActiveArticle] = useState(0);
  const [newsArticles, setNewsArticles] = useState([]);
  const classes = useStyles();

  useEffect(() => {
    alanBtn({
      key: process.env.REACT_APP_SDK_ALAN,
      onCommand: ({ command, articles, number }) => {
        if (command === 'newHeadlines') {
          setNewsArticles(articles);
          setActiveArticle(-1);
        } else if (command === 'highlight') {
          setActiveArticle((prevActiveArticle) => prevActiveArticle + 1);
        } else if (command === 'open') {
          const parsedNumber = number.length > 2 ? wordsToNumbers((number), { fuzzy: true }) : number;
          const article = articles[parsedNumber - 1];

          if (parsedNumber > articles.length) {
            alanBtn().playText('Please try that again...');
          } else if (article) {
            window.open(article.url, '_blank');
            alanBtn().playText('Opening...');
          } else {
            alanBtn().playText('Please try that again...');
          }
          
        }
      },
    });
  }, []);

  return (
    <div>
      <div className={classes.logoContainer}>
        {newsArticles.length ? (
          <div className={classes.infoContainer}>
            <div className={classes.card}><Typography variant="h5" component="h2">Try saying: <br /><br />Open article number [4]</Typography></div>
            <div className={classes.card}><Typography variant="h5" component="h2">Try saying: <br /><br />Go back</Typography></div>
          </div>
        ) : null}
        <img src={logo} className={classes.alanLogo} alt="logo" />
        <h1>News AI</h1>
        <h6>Search, Explore and Discover !</h6>
      </div>
      <NewsCards articles={newsArticles} activeArticle={activeArticle} />
      
      {!newsArticles.length ? (
        <div className={classes.footer}></div>
      ) : null}
    </div>
  );
};

export default App;
