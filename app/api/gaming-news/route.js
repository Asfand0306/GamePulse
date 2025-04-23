// app/api/gaming-news/route.js
export async function GET() {
    try {
      // Expanded gaming keywords for better filtering
      const gamingKeywords = 'gaming OR "video games" OR playstation OR xbox OR nintendo OR "pc games" OR steam OR "game release" OR esports OR "game review" OR patch OR update OR DLC';
      
      // Expanded list of gaming news sources
      const targetSources = [
        "ign.com",
        "gamespot.com",
        "pcgamer.com",
        "polygon.com",
        "eurogamer.net",
        "rockpapershotgun.com",
        "kotaku.com",
        "destructoid.com",
        "theverge.com/gaming",
        "gameinformer.com",
        "vg247.com",
        "dualshockers.com",
      ];
      
      console.log("Fetching news from NewsAPI...");
      
      // Call NewsAPI from the server side with increased pageSize
      const response = await fetch(
        `https://newsapi.org/v2/everything?` +
        `q=${encodeURIComponent(gamingKeywords)}` +
        `&domains=${targetSources.join(',')}` +
        `&language=en` +
        `&sortBy=publishedAt` +
        `&pageSize=50` +  // Increased from 30 to 50
        `&apiKey=${process.env.NEWS_API_KEY}`
      );
  
      console.log("NewsAPI response status:", response.status);
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error("NewsAPI error:", errorData);
        return Response.json({ error: errorData.message || "NewsAPI error" }, { status: response.status });
      }
      
      const data = await response.json();
      console.log(`Received ${data.articles?.length || 0} articles from NewsAPI`);
      
      // Transform and filter the response
      const gamingNews = data.articles?.map(article => ({
        title: article.title,
        text: article.description || article.content,
        summary: article.description,
        url: article.url,
        image: article.urlToImage,
        publish_date: article.publishedAt,
        source: {
          name: article.source?.name || "Gaming News"
        }
      })) || [];
      
      console.log(`Returning ${gamingNews.length} processed articles`);
      return Response.json({ news: gamingNews });
    } catch (error) {
      console.error('Server error fetching gaming news:', error);
      return Response.json({ error: error.message || "Internal server error" }, { status: 500 });
    }
}